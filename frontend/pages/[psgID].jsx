import React, { useEffect } from 'react'
import { md } from '../helpers/markdown' 
import _ from 'lodash'
import * as prettier from 'prettier'
import { describePsgIDs, describePassage } from './../providers/passage'

const BlogPage = ({ contentHtml }) => {
    const a = 1
    return (
        <div className="page-article">
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
    const content = prettier.format(`# ${passage.title}\n` + passage.content, { parser: 'markdown' })

    return {
        props: {
            contentHtml: md.render(content),
            passage: _.omit(passage, ['updateTime', 'createTime'])
        }
    }
}