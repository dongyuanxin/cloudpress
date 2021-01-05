import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Anchor, Row, Col, Tree } from "antd";
import { LinkOutlined } from '@ant-design/icons'
import { md, parseAnchors } from "../helpers/markdown";
import SeoHead from "./../components/SeoHead/";
import { PassageProvider } from "./../providers/passage";
import { PassageReq } from './../requests/passage'
import {
    DownOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";

const { Link } = Anchor;

const SELECTED_KEYS_KEY = 'cloudpress-passage-page-selected-keys'

const BlogPage = ({ contentHtml, passage, description, anchors }) => {
    const router = useRouter();
    const [treeNode, setTreeNode] = useState([{ title: '文章目录加载中', key: 'loading', children: [], icon: <LoadingOutlined /> }])
    const [hasContentMap, sethasContentMap] = useState({})
    const [selectedKeys, setSelectedKeys] = useState([])
    const [expandedKeys, setExpandedKeys] = useState([])

    useEffect(() => {
        const { query } = router
        setSelectedKeys([query.psgID])

        PassageReq.describePassageTree()
            .then(res => {
                setTimeout(() => {
                    handleTreeNode(res)
                    setTreeNode(res.children || [])
                }, 500)
            })
    }, [])

    useEffect(() => {
        // 文章树更新后，DFS遍历保存文章标识对应是否有内容
        const newMap = {}
        calcTreeNodeMap({ key: 'root', children: treeNode }, newMap)
        sethasContentMap(newMap)

        // DFS 遍历展开节点的路径
        const { query } = router
        const keys = calcSelectedKeys(query.psgID, { key: 'root', children: treeNode })
            .filter(key => key !== 'root')
        setExpandedKeys(readExpandedKeysFromLocal(keys))
    }, [treeNode])

    useEffect(() => {
        // 每次更新展开的节点数据后，都同步保存到本地
        localStorage.setItem(SELECTED_KEYS_KEY, JSON.stringify(expandedKeys))
    }, [expandedKeys])

    /**
     * 将后端返回的整体结构数据进行处理
     */
    const handleTreeNode = (treeNode) => {
        if (treeNode.hasContent) {
            treeNode.title = <span style={{ display: "inline-flex", alignItems: "center" }}>
                {treeNode.title}
                <LinkOutlined style={{ marginLeft: "4px" }} />
            </span>
        }
        if (Array.isArray(treeNode.children)) {
            treeNode.children.forEach(item => handleTreeNode(item))
        }
    }

    /**
     * 查找从根节点到指定节点的路径上的所有节点的key
     */
    const calcSelectedKeys = (targetKey, treeNode) => {
        const keys = []
        const found = calcSelectedKeys(treeNode)
        if (found) {
            keys.push(treeNode.key)
        }
        return keys

        function calcSelectedKeys(_treeNode) {
            if (_treeNode.key === targetKey) {
                return true
            }

            if (Array.isArray(_treeNode.children)) {
                for (const item of _treeNode.children) {
                    const found = calcSelectedKeys(item)
                    if (found) {
                        keys.push(item.key)
                        return true
                    }
                }
            }

            return false
        }
    }

    /**
     * 记录对应节点是否有文章内容
     * 数据结构：Map<string, boolean>
     */
    const calcTreeNodeMap = (treeNode, map = {}) => {
        map[treeNode.key] = treeNode.hasContent || false
        if (Array.isArray(treeNode.children)) {
            treeNode.children.forEach(item => calcTreeNodeMap(item, map))
        }
    }

    /**
     * 从本地读取之前展开的节点，并和expandedKeys进行率重操作
     */
    const readExpandedKeysFromLocal = (expandedKeys = []) => {
        let localKeys = localStorage.getItem(SELECTED_KEYS_KEY)
        let decodeLocalKeys = []
        try {
            decodeLocalKeys = JSON.parse(localKeys)
            decodeLocalKeys = Array.isArray(decodeLocalKeys) ? decodeLocalKeys : []
        } catch (error) { }

        const keysSet = new Set([...decodeLocalKeys, ...expandedKeys])
        const keysSetArr = []
        for (const key of keysSet) {
            keysSetArr.push(key)
        }

        return keysSetArr
    }

    /**
     * 渲染左侧文章树
     */
    const renderTree = () => {
        return <Tree
            style={{ fontWeight: 'bold' }}
            onSelect={
                (selectedKeys, info) => {
                    const selectedKey = selectedKeys[0]
                    setSelectedKeys(selectedKeys)
                    if (
                        selectedKey // 选中状态
                        && !info.node.expanded // 当前节点没有展开
                        && info.node.children?.length > 0 // 有子节点
                        && !hasContentMap[selectedKey] // 无需跳转
                    ) {
                        setExpandedKeys([...expandedKeys, selectedKey])
                    }
                    if (hasContentMap[selectedKey] && router.query.psgID !== selectedKey) {
                        router.push(`/${selectedKey}`)
                    }
                }
            }
            onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
            showIcon
            defaultExpandParent
            defaultSelectedKeys={[]}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            switcherIcon={<DownOutlined />}
            treeData={treeNode}
        />
    };

    /**
     * 渲染右侧目录树
     */
    const renderToc = () => {
        const links = [];
        for (let i = 0; i < anchors.length; ++i) {
            const anchor = anchors[i];
            links.push(
                <Link
                    href={anchor.href}
                    key={i}
                    title={anchor.text}
                    className={`anchor-${anchor.tag}`}
                />
            );
        }
        return links;
    };

    return (
        <>
            <SeoHead
                title={`${passage.title} | 心谭博客`}
                description={description}
            />
            <Row gutter={36} className="page-article">
                <Col span={6}>
                    {renderTree()}
                </Col>
                <Col span={anchors.length ? 14 : 18}>
                    <div>
                        <h1>{passage.title}</h1>
                        <div
                            className="markdown"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        ></div>
                    </div>
                </Col>
                <Col span={anchors.length ? 4 : 0}>
                    {anchors.length && <Anchor>{renderToc()}</Anchor>}
                </Col>
            </Row>
        </>
    );
};

export default BlogPage;

export async function getStaticPaths() {
    const psgIDs = await PassageProvider.describePsgIDs();
    const paths = psgIDs.map((psgID) => ({
        params: {
            psgID,
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const passage = await PassageProvider.describePassage(params.psgID);
    const { content, description } = passage;
    const contentHtml = md.render(content);
    const copyRightHtml = `<div class="page-article-copyright">${process.env.COPYRIGHT_CONTENT}</div>`

    return {
        props: {
            contentHtml: contentHtml + copyRightHtml,
            description,
            passage: _.omit(passage, [
                "filepath",
                "mtime",
                "content",
            ]),
            anchors: parseAnchors(contentHtml),
        },
    };
}
