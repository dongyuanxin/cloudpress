import React, { useEffect } from 'react'
import { md } from './../markdown/'
import { fetchPassage } from './../mock/passage' 

const BlogPage = ({ html }) => {
    const a = 1
    return (
        <div 
            style={{lineHeight: '1.75', fontSize: '15px', background: 'white', padding: '50px 150px'}}
            dangerouslySetInnerHTML={{__html: html}}
        ></div>
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