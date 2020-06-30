import React, { useEffect } from 'react'
import { md } from '../helpers/markdown' 
import _ from 'lodash'
import * as prettier from 'prettier'
import removeMd from 'remove-markdown'
import SeoHead from './../components/SeoHead/'
import { describePsgIDs, describePassage } from './../providers/passage'

const BlogPage = ({ contentHtml, passage, description }) => {
    return (
        <> 
            <SeoHead
                title={`${passage.title} | 心谭博客`}
                description={description}
            />
            <div className="page-article">
                <h1>{passage.title}</h1>
                <div className="markdown" dangerouslySetInnerHTML={{__html: contentHtml}}></div>
            </div>
        </>
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
            description: 
                removeMd(content)
                    .replace(/\n/g, "")
                    .trim()
                    .slice(0, 155) + "...",
            passage: _.omit(passage, ['updateTime', 'createTime', 'content', 'id', '_id'])
        }
    }
}