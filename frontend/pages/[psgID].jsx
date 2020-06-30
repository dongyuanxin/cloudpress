import React, { useEffect } from 'react'
import { md } from '../helpers/markdown' 
import _ from 'lodash'
import * as prettier from 'prettier'
import { Row, Col } from 'antd' 
import { EyeOutlined, MessageOutlined } from './../components/Icon'
import { describePsgIDs, describePassage } from './../providers/passage'

const BlogPage = ({ contentHtml, passage }) => {
    return (
        <div className="page-article">
            <h1>{passage.title}</h1>
            {/* <Row gutter={8}>
                <Col span={8}>
                    发布于 { passage.publishTime }
                </Col>
            </Row> */}
            <div className="markdown" dangerouslySetInnerHTML={{__html: contentHtml}}></div>
        </div>
    )
}

export default BlogPage

export async function getStaticPaths() {
    const psgIDs = await describePsgIDs()
    const paths = psgIDs.map(psgID => ({
        params: {
            psgID
        }
    }))
    
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const passage = await describePassage(params.psgID)
    const content = prettier.format(passage.content, { parser: 'markdown' })

    return {
        props: {
            contentHtml: md.render(content),
            passage: _.omit(passage, ['updateTime', 'createTime', 'content', 'id', '_id'])
        }
    }
}