import container from "markdown-it-container";
import checkbox from "markdown-it-checkbox";
import comments from "markdown-it-inline-comments";
import anchor from "markdown-it-anchor";
import footnote from "markdown-it-footnote";

// 标题锚点
const anchorPlugin = [
    anchor,
    {
        permalink: true,
        permalinkSymbol: "#",
        permalinkBefore: true,
    },
];

// markdown注释
const commentsPlugin = [comments];

// 选择框
const checkBoxPlugin = [checkbox];

// 脚注
const footnotePlugin = [footnote];

// :::容器
const containerPlugins = ["warning", "error", "tip"].map(createContainer);

export const plugins = [
    anchorPlugin,
    commentsPlugin,
    checkBoxPlugin,
    footnotePlugin,
    ...containerPlugins,
];

function createContainer(klass) {
    return [
        container,
        klass,
        {
            render(tokens, idx) {
                const token = tokens[idx];
                const info = token.info.trim().slice(klass.length).trim();
                if (token.nesting === 1) {
                    return `<div class="markdown-custom-block markdown-custom-block--${klass}">
<p class="markdown-custom-block-title markdown-custom-block-title--${klass}">
    ${info}
</p>\n`;
                } else {
                    return `</div>\n`;
                }
            },
        },
    ];
}
