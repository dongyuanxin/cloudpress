import Head from "next/head";

export default function SeoHead({
    title = "心谭博客",
    keywords = "CloudPress,云开发,开源博客,前端知识图谱,算法题解,node开发,javascript编程,css3动画,react,编程分享",
    description = "专注前端与算法，目前已有前端面试、剑指OFFER·JS、数据结构等系列专题",
    author = "董沅鑫 心谭",
    children,
}) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
            <meta name="author" content={author} />
            {children}
        </Head>
    );
}
