import { Injectable } from '@nestjs/common';
import { PassageSchema } from './passage.interface';
import { NOTES_FOLDER } from './../../constants'
import * as fs from 'fs'
import * as path from 'path'
import * as moment from 'moment'
import * as yaml from 'js-yaml'
import * as prettier from 'prettier'
import { LoggerService } from 'src/services/logger.service';

const fsPromises = fs.promises;

@Injectable()
export class PassageService {
    private readonly folderName: string
    private readonly mdRe: RegExp
    private readonly validNameRe: RegExp
    private readonly timeFormat: string
    private passages: PassageSchema[]

    constructor(
        private readonly loggerService: LoggerService
    ) {
        this.folderName = NOTES_FOLDER
        this.mdRe = /(---\n((.|\n)*?)\n---\n)?((.|\n)*)/
        this.validNameRe = /^\d+\./
        this.timeFormat = 'YYYY-MM-DD HH:mm:ss'
        this.passages = []
    }

    public async load(asc: boolean = false) {
        if (!fs.existsSync(this.folderName)) {
            throw new Error(`Load passage fail: ${this.folderName} is invalid`)
        }

        this.loggerService.info({ content: 'Start load passage' })
        this.passages = []
        await this._load(this.folderName)
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
        this.loggerService.info({ content: `Finish load ${this.passages.length} valid passages` })
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

    private async _load(parentPath: string) {
        const folders = await fsPromises.readdir(parentPath);

        for (const folderName of folders) {
            if (!this.isValidName(folderName)) {
                continue
            }

            const folderPath = path.resolve(parentPath, folderName)
            const stat = await fsPromises.stat(folderPath)

            if (stat.isFile() && folderName.endsWith('.md')) {
                try {
                    this.passages.push(await this.parseFile(folderPath))
                } catch (error) {
                    this.loggerService.warn({
                        content: `Warning: ${folderPath} parse failed.`
                    })
                }
            } else if (stat.isDirectory()) {
                await this._load(folderPath)
            }
        }
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

        if (yamlInfo) {
            let mtimeStr = this.formatDate(yamlInfo.date)
            let formatMdContent = prettier.format(mdContent, { parser: 'markdown' })
            return {
                filepath,
                title: yamlInfo.title,
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
        throw new Error(`${filepath} is invalid`)
    }

    private formatDate(timeStr): string {
        if (!timeStr) {
            return moment().format(this.timeFormat)
        }

        let res = moment(timeStr).format(this.timeFormat)
        if (res.toLowerCase().includes('invalid')) {
            return moment().format(this.timeFormat)
        } else {
            return res
        }
    }
}