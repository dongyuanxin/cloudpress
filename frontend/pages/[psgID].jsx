import React, { useEffect } from "react";
import _ from "lodash";
import { Anchor, Row, Col } from "antd";
import { md, parseAnchors } from "../helpers/markdown";
import SeoHead from "./../components/SeoHead/";
import { PassageProvider } from "./../providers/passage";

const { Link } = Anchor;

const BlogPage = ({ contentHtml, passage, description, anchors }) => {
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
                <Col span={anchors.length ? 20 : 24}>
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

    return {
        props: {
            contentHtml,
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
