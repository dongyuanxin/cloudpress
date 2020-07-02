import jsdom from "jsdom";

const { JSDOM } = jsdom;

/**
 * 根据html源码结构，获取标题和对应锚点
 * @param {string} html
 * @param {number[]} levels 支持的标题级别
 * @return {object[]}
 */
export function parseAnchors(html, levels = [2, 3, 4, 5]) {
    const tags = levels.map((level) => `h${level}`);
    const {
        window: { document },
    } = new JSDOM(html);

    const titleDoms = document.body.querySelectorAll(tags.join(","));
    const anchors = [];
    for (const dom of titleDoms) {
        const aTag = dom.querySelector("a");
        anchors.push({
            tag: dom.tagName.toLocaleLowerCase(),
            text: dom.textContent.slice(1).trim(),
            href: aTag.getAttribute("href"),
        });
    }

    return anchors;
}
