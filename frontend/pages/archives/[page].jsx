import React, { useState, useEffect } from "react";
import { message, Row, Col, Switch, Pagination } from "antd";
import _ from "lodash";
import SeoHead from "./../../components/SeoHead/";
import { countPassages, describePassages } from "./../../providers/passage";

const PAGE_SIZE = 10; // 每页大小

const ArchievePage = ({ passages, total, page }) => {
    const [easyMode, setEasyMode] = useState(true);

    const renderPassage = (passage) => {
        const { title, description, index, publishTime, psgID } = passage;

        return (
            <a
                target="_self"
                href={`/${psgID}`}
                style={{ display: "block" }}
                key={index}
            >
                <Row
                    justify="space-between"
                    gutter={24}
                    className="page-archive-psg"
                >
                    <Col
                        span={16}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <div className="page-archive-psg-icon">{index}</div>
                        <div className="page-archive-psg-title">
                            <h2>{title}</h2>
                            <p>{description}</p>
                        </div>
                    </Col>

                    <Col
                        span={8}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        {/* <span className="page-archive-psg-info">
                        <EyeOutlined style={{marginRight: '5px'}}/>1000+
                    </span>
                    <span className="page-archive-psg-info">
                        <MessageOutlined style={{marginRight: '5px'}}/>0
                    </span> */}
                        <span className="page-archive-psg-info">
                            {publishTime}
                        </span>
                    </Col>
                </Row>
            </a>
        );
    };

    const renderPagination = () => {
        function itemRender(current, type, originalElement) {
            if (type === "page") {
                return (
                    <a target="_self" href={`/archives/${current}`}>
                        {current}
                    </a>
                );
            }

            return originalElement;
        }

        return (
            <Pagination
                showSizeChanger={false}
                total={total}
                itemRender={itemRender}
                defaultCurrent={page}
            />
        );
    };

    const toogleMode = (checked) => {
        if (!checked) {
            message.warn("业务需求多，下班熬夜肝");
            return;
        }
        setEasyMode(checked);
    };

    return (
        <>
            <SeoHead
                title={`归档-第${page}页 | 心谭博客`}
                description={passages
                    .map((passage) => passage.title)
                    .join("，")}
            />
            <div className="page-archive-head">
                <div className="page-archive-head-left">
                    <span>全部文章</span>
                    <span>all({total})</span>
                </div>
                <div className="page-archive-head-left">
                    <Switch
                        checked={easyMode}
                        onChange={toogleMode.bind(null)}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <strong style={easyMode ? { color: "#40a9ff" } : null}>
                        简洁模式
                    </strong>
                </div>
            </div>

            <div>{passages.map((passage) => renderPassage(passage))}</div>

            <div className="page-archive-pagination">{renderPagination()}</div>
        </>
    );
};

export default ArchievePage;

export async function getStaticPaths() {
    const total = await countPassages();
    const pageNum = Math.ceil(total / PAGE_SIZE);
    const paths = [];
    for (let i = 0; i < pageNum; ++i) {
        paths.push({
            params: {
                page: (i + 1).toString(),
            },
        });
    }
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const total = await countPassages();
    const page = parseInt(params.page);
    const passages = await describePassages(PAGE_SIZE, page);

    return {
        props: {
            params,
            total,
            page,
            passages: passages.map((passage, index) => {
                passage.index = (page - 1) * PAGE_SIZE + index + 1;
                passage.description =
                    (passage.content || "")
                        .replace(/\n/g, "")
                        .trim()
                        .slice(0, 155) + ".....";
                return _.omit(passage, ["updateTime", "createTime", "content"]);
            }),
        },
    };
}
