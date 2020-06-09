import container from 'markdown-it-container'
import checkbox from 'markdown-it-checkbox'
import comments from 'markdown-it-inline-comments'
import anchor from 'markdown-it-anchor'
import footnote from 'markdown-it-footnote'

// 标题锚点
const anchorPlugin = [
    anchor,
    {
        permalink: true,
        permalinkSymbol: '#',
        permalinkBefore: true
    }
]

// markdown注释
const commentsPlugin = [comments]

// 选择框
const checkBoxPlugin = [checkbox]

// 脚注
const footnotePlugin = [footnote]

// :::容器
const containerPlugins = ['warning', 'error', 'danger'].map(createContainer)

export const plugins = [
    anchorPlugin, 
    commentsPlugin, 
    checkBoxPlugin, 
    footnotePlugin,
    ...containerPlugins
]

function createContainer(klass) {
    return [container, klass, {
        render (tokens, idx) {
            const token = tokens[idx]
            const info = token.info.trim().slice(klass.length).trim()
            if (token.nesting === 1) {
                return `<div class="${klass} custom-block"><p class="custom-block-title">${info | info.toLocaleUpperCase()}</p>\n`
            } else {
                return `</div>\n`
            }
        }
    }]
}