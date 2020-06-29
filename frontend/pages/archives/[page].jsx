import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { EyeOutlined, MessageOutlined } from './../../components/Icon'
import { message, Row, Col, Switch, Pagination } from 'antd';
import { countPassages, describePassages } from './../../providers/passage'

const PAGE_SIZE = 10 // 每页大小

const ArchievePage = ({ passages, total }) => {
    const [easyMode, setEasyMode] = useState(true)

    const renderPassage = (passage) => {
        const { title, description, index} = passage

        return <Row justify="space-between" gutter={24} className="page-archive-psg">
            <Col span={16} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div className="page-archive-psg-icon">{index}</div>
                <div className="page-archive-psg-title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </Col>

            <Col span={8} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <span className="page-archive-psg-info">
                    <EyeOutlined style={{marginRight: '5px'}}/>100
                </span>
                <span className="page-archive-psg-info">
                    <MessageOutlined style={{marginRight: '5px'}}/>123
                </span>
                <span className="page-archive-psg-info">
                    2020.02.02
                </span>
            </Col>
        </Row>
    }

    const renderPagination = () => {
        function itemRender(current, type, originalElement) {
            // if (type === 'page') {
            //     return <a href={'https://xxoo521.com/' + current}>{current}</a>
            // }

            return originalElement;
        }

        return <Pagination showSizeChanger={false} total={total} itemRender={itemRender} />
    }

    const toogleMode = (checked) => {
        if (!checked) {
            message.warn('功能未开放')
            return
        }
        setEasyMode(checked)
    }

    return (
        <>
            <div className="page-archive-head">
                <div className="page-archive-head-left">
                    <span>
                        全部文章
                    </span>
                    <span>
                        all(42)
                    </span>
                </div>
                <div className="page-archive-head-left">
                    <Switch checked={easyMode} onChange={toogleMode.bind(null)}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<strong style={easyMode ? {color: "#40a9ff"} : null}>简洁模式</strong> 
                </div>
            </div>

            <div>
                {renderPassage(passages[0], 0)}
                {renderPassage(passages[1], 1)}
            </div>

            <div className="page-archive-pagination">
                {renderPagination()}
            </div>
        </>
    )
}

export default ArchievePage

export async function getStaticPaths() {
    const total = await countPassages()
    const pageNum = Math.ceil(total / PAGE_SIZE)
    const paths = []
    for (let i = 0; i < pageNum; ++i) {
        paths.push({
            params: {
                page: (i + 1).toString()
            }
        })
    }
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const total = await countPassages()
    const passages = await describePassages(PAGE_SIZE, parseInt(params.page))
    return {
        props: {
            params,
            total,
            passages: [
                {
                    title: 'JetBrains全系列软件激活教程激活码以及JetBrains系列软件汉化包',
                    date: '2020-06-04',
                    description: 'JetBrains全系列软件激活教程，共有两种方法，喜欢哪种用哪种。另外附上JetBrains系列软件的汉化包以及中文设置教程，希望大家喜欢。',
                    tags: [
                        'a',
                        'b',
                        'c'
                    ],
                    index: 0
                },
                {
                    title: 'Autodesk Maya 2020 Mac安装激活教程，包教包会！',
                    date: '2020-05-27',
                    description: 'AutoDesk 系列软件破解激活非常麻烦，很多小伙伴下载完一脸懵逼，不知道如何能可以激活，今天MacWk为大家奉上一篇 Autodesk Maya 2020 for Mac 详细的激活教程，小伙伴们以后自己就可以愉快的激活啦！',
                    tags: [
                        'a',
                        'b',
                        'c'
                    ],
                    index: 10
                }
            ]
        }
    }
}