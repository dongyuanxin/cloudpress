import React, { useEffect } from 'react'
import { md } from '../helpers/markdown'
import { fetchPassage } from './../mock/passage' 

const BlogPage = ({ html }) => {
    const a = 1
    return (
        <div className="page-article">
            <div className="markdown" dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
}

export default BlogPage

export async function getStaticProps() {
    const { passage } = await fetchPassage()
    return {
        props: {
            html: md.render(passage)
        }
    }
}