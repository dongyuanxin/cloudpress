import { Injectable, Scope } from '@nestjs/common';
import { PassageSchema, PassageNode } from './passage.interface';
import { NOTES_FOLDER, COLLECTION_PASSAGES, COLLECTION_INFOS } from './../../constants'
import * as fs from 'fs'
import * as path from 'path'
import * as moment from 'moment'
import * as yaml from 'js-yaml'
import * as prettier from 'prettier'
import { LoggerService } from 'src/services/logger.service';
import { TcbService } from 'src/services/tcb.service';
import { AsyncLimitService } from 'src/services/async-limit.service';

import { EventEmitter } from 'events';
import { EnvService } from 'src/services/env.service';

const fsPromises = fs.promises;

let uploaded = false;

const INFO_KEYS = {
    passageTree: 'passageTree'
}

@Injectable({
    scope: Scope.DEFAULT
})
export class PassageService extends EventEmitter {
    private readonly folderName: string
    private readonly mdRe: RegExp
    private readonly validNameRe: RegExp
    private readonly timeFormat: string
    private passages: PassageSchema[]
    private passageTree: PassageNode

    constructor(
        private readonly loggerService: LoggerService,
        private readonly tcbService: TcbService,
        private readonly asyncLimitService: AsyncLimitService,
        private readonly envService: EnvService
    ) {
        super()
        this.folderName = NOTES_FOLDER
        this.mdRe = /(---\n((.|\n)*?)\n---\n)?((.|\n)*)/
        this.validNameRe = /^\d+\./
        this.timeFormat = 'YYYY-MM-DD HH:mm:ss'
        this.passages = []
        this.passageTree = {
            title: 'root',
            key: 'root',
            hasContent: false,
            children: []
        }

        this.asyncLimitService.init('passage', 6)

        this.on('upload', this.onUpload)
    }

    public async load(asc: boolean = false) {
        // 是否开启本地上传
        const enableUpload = this.envService.getEnvironmentVariable('ENABLE_UPLOAD') === 'true'
        if (enableUpload) {
            await this.loadFromFs()
        } else {
            await this.loadFromDb()
        }

        if (asc) {
            this.passages.sort((a, b) => {
                if (a.date < b.date) return -1
                else if (a.date > b.date) return 1
                return 0
            })
        } else {
            this.passages.sort((a, b) => {
                if (a.date < b.date) return 1
                else if (a.date > b.date) return -1
                return 0
            })
        }
    }

    /**
     * 从数据库读取文章数据
     */
    private async loadFromDb() {
        const infosCollection = this.tcbService.getCollection(COLLECTION_INFOS)
        const infosRes = await infosCollection.where({ infoKey: INFO_KEYS.passageTree }).get()
        this.passageTree = infosRes.data.length
            ? infosRes.data[0].infoVal
            : { title: '获取数据失败', hasContent: false, children: [], key: 'fail-get-passage-tree' }

        this.loggerService.info({ content: `Finish load passage tree`, logType: 'LoadPassageTreeFromDbSuccess' })

        const passageCollection = this.tcbService.getCollection(COLLECTION_PASSAGES)
        const { total: passageCount } = await passageCollection.count()
        for (let i = 0; i <= Math.floor(passageCount / 100); ++i) {
            const res = await passageCollection.where({}).skip(i * 100).limit(100).get()
            this.passages.push(...res.data)
        }

        this.loggerService.info({ content: `Finish load ${this.passages.length} passages`, logType: 'LoadPassageFromDbSuccess' })
    }

    /**
     * 从文件系统中解析文章数据，并上传
     */
    private async loadFromFs() {
        if (!fs.existsSync(this.folderName)) {
            throw new Error(`Load passage fail: ${this.folderName} is invalid`)
        }

        this.loggerService.info({ content: 'Start load passage', logType: 'LoadPassageFromFsStart' })
        this.passages = []

        await this._load(this.folderName, this.passageTree)
        this.emit('upload')

        this.loggerService.info({ content: `Finish load ${this.passages.length} valid passages`, logType: 'LoadPassageFromFsSuccess' })
        return this.passages
    }

    public describePassageById(psgId: string): PassageSchema {
        return this.passages.find(item => item.permalink === psgId)
    }

    public describePassages(limit: number = 10, page: number = 1): PassageSchema[] {
        return this.passages.slice((page - 1) * limit, page * limit)
    }

    public countAllPassages(): number {
        return this.passages.length
    }

    public describeAllPassageIds(): string[] {
        return this.passages.map(item => item.permalink)
    }

    public describePassageTree(): PassageNode {
        return this.passageTree
    }

    private async _load(parentPath: string, parentNode: PassageNode) {
        const folders = await fsPromises.readdir(parentPath);

        for (const folderName of folders) {
            if (!this.isValidName(folderName)) {
                continue
            }

            const folderPath = path.resolve(parentPath, folderName)
            const stat = await fsPromises.stat(folderPath)

            if (stat.isFile() && folderName.endsWith('.md')) {
                try {
                    const parsed = await this.parseFile(folderPath)
                    this.passages.push(parsed)
                    parentNode.title = parsed.filename
                    parentNode.key = parsed.permalink
                    parentNode.hasContent = true
                } catch (error) {
                    this.loggerService.error({
                        content: `Warning: ${folderPath} parse failed.`,
                        errMsg: error.message
                    })
                }
            } else if (stat.isDirectory()) {
                const passageNode: PassageNode = {
                    key: `cloudpress-file-${folderName}`,
                    title: folderName.split('.')[1],
                    hasContent: false,
                    children: []
                }
                parentNode.children.push(passageNode)
                await this._load(folderPath, passageNode)
            }
        }
    }

    private async onUpload() {
        if (uploaded) {
            return this.loggerService.info({
                logType: 'UploadRepeated',
                content: 'Please close and rerun server'
            })
        }
        // 1、上传文章目录树结构
        await this.updatePassageTree()
        // 2、上传所有文章
        const promises = []
        const { pLimit } = this.asyncLimitService.get('passage')
        for (const passage of this.passages) {
            promises.push(pLimit(() => this.updatePassage(passage)))
        }
        await Promise.all(promises)
        uploaded = true
        this.loggerService.info({
            logType: 'UploadSuccess'
        })
    }

    /**
     * permalink 是唯一索引
     */
    private async updatePassage(passage: PassageSchema) {
        const collection = this.tcbService.getCollection(COLLECTION_PASSAGES)
        const res1 = await collection.where({ permalink: passage.permalink }).get()
        if (res1.data.length) {
            await collection.doc(res1.data[0]._id).update(passage)
        } else {
            await collection.add(passage)
        }
        this.loggerService.info({
            logType: 'UpdatePassageSuccess',
            content: JSON.stringify({
                title: passage.title,
                id: passage.permalink
            })
        })
    }

    private async updatePassageTree() {
        const collection = this.tcbService.getCollection(COLLECTION_INFOS)
        const res = await collection.where({ infoKey: INFO_KEYS.passageTree }).get()
        if (res.data.length) {
            await collection.doc(res.data[0]._id).update({
                infoVal: this.passageTree
            })
        } else {
            await collection.add({
                infoKey: INFO_KEYS.passageTree,
                infoVal: this.passageTree
            })
        }
        this.loggerService.info({
            logType: 'UpdatePassageTreeSuccess'
        })
    }

    private isValidName(name: string): boolean {
        if (name.toLocaleLowerCase() === 'readme.md') {
            return true
        }
        return this.validNameRe.test(name);
    }

    private async parseFile(filepath: string): Promise<PassageSchema> {
        const content = await fsPromises.readFile(filepath, {
            encoding: 'utf8'
        })
        const [, , yamlContent, , mdContent] = this.mdRe.exec(content)
        const yamlInfo = yaml.safeLoad(yamlContent)

        if (yamlInfo && yamlInfo.permalink) {
            let mtimeStr = this.formatDate(yamlInfo.date)
            let formatMdContent = prettier.format(mdContent, { parser: 'markdown' })
            let filename = this.parseName(filepath)
            return {
                filename,
                filepath,
                title: yamlInfo.title || filename,
                content: formatMdContent,
                description: formatMdContent
                    .replace(/\n/g, "")
                    .trim()
                    .slice(0, 155) + ".....",
                mtime: mtimeStr,
                date: mtimeStr.slice(0, 10),
                permalink: yamlInfo.permalink
            }
        }
        throw new Error(`${filepath}'s frontmatter is invalid`)
    }

    private parseName(filepath: string): string {
        const info = path.parse(filepath)
        if (info.name.toLocaleLowerCase() !== 'readme') {
            return info.name
        } else {
            // /workhome/notes/patha/pathb/06.云开发.md
            // => 云开发
            return info.dir.split(path.sep).pop().replace(/^\d*?\./, '')
        }
    }

    private formatDate(timeStr): string {
        if (!timeStr) {
            return moment().format(this.timeFormat)
        }

        const instance = moment(timeStr, true)
        if (!instance.isValid()) {
            throw new Error(`frontmatter.date is valid`)
        }

        const res = instance.format(this.timeFormat)
        if (res.toLowerCase().includes('invalid')) {
            return moment().format(this.timeFormat)
        } else {
            return res
        }
    }
}