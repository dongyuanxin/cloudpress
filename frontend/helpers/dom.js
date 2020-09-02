/**
 * 查询dom的上级元素是否有className
 * @param {DOM} dom
 * @param {string} className
 */
export function findParentClass(dom, className) {
    if (!dom) {
        return false;
    }
    if (dom.className === className) {
        return true;
    }
    return findParentClass(dom.parentNode, className);
}
