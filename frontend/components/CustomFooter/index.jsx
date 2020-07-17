import { useState } from "react";
import { Row, Col, Layout, Divider } from "antd";

const { Footer } = Layout;

const CustomFooter = ({ style }) => {
    const cols = [
        {
            name: "帮助",
            items: [
                {
                    name: "源码地址",
                    url: "https://github.com/dongyuanxin/cloudpress",
                },
                {
                    name: "意见反馈",
                    url: "https://github.com/dongyuanxin/cloudpress/issues",
                },
                {
                    name: "常见问题",
                    url: "https://github.com/dongyuanxin/cloudpress/issues",
                },
                {
                    name: "更新日志",
                    url:
                        "https://github.com/dongyuanxin/cloudpress/commits/master",
                },
            ],
        },
        {
            name: "技术栈",
            items: [
                {
                    name: "CloudBase",
                    url: "https://www.cloudbase.net/",
                },
                {
                    name: "Next.js",
                    url: "https://nextjs.org/",
                },
                {
                    name: "NestJS",
                    url: "https://nestjs.com/",
                },
                {
                    name: "Ant Design",
                    url: "https://ant.design/",
                },
            ],
        },
        {
            name: "其他平台",
            items: [
                {
                    name: "Github",
                    url: "https://github.com/dongyuanxin",
                },
                {
                    name: "junjin.im",
                    url: "https://juejin.im/user/5b91fcf06fb9a05d3c7fd4a5",
                },
                {
                    name: "SegmentFault",
                    url: "https://segmentfault.com/u/godbmw",
                },
                {
                    name: "xin-tan.com",
                    url: "https://xin-tan.com/",
                },
            ],
        },
    ];

    const rendersCols = () => {
        const colSpan = Math.floor(24 / cols.length);

        const renderItems = (items = []) => {
            return items.map((item, index) => (
                <Row key={index} style={{ margin: "12px 0" }}>
                    <a
                        style={{ color: "rgba(255,255,255,.9)" }}
                        href={item.url}
                        target="_blank"
                    >
                        {item.name}
                    </a>
                </Row>
            ));
        };

        return (
            <Row gutter={24}>
                {cols.map((col, index) => (
                    <Col key={index} span={colSpan}>
                        <h2
                            style={{
                                color: "rgba(255,255,255,.9)",
                                marginBottom: "24px",
                                fontSize: "16px",
                            }}
                        >
                            {col.name}
                        </h2>
                        {renderItems(col.items)}
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <div style={{ background: "#000" }}>
            <Footer style={{ ...style, background: "#000", padding: "24px 0" }}>
                {rendersCols()}
                <Divider style={{ borderTopColor: "rgba(255,255,255,.4)" }} />
                <div
                    style={{
                        color: "rgba(255,255,255,.4)",
                        textAlign: "center",
                        fontSize: "14px",
                    }}
                >
                    本站总访问量
                    <span
                        id="busuanzi_container_site_pv"
                        style={{ color: "rgba(255,255,255,.9)" }}
                    >
                        &nbsp;<span id="busuanzi_value_site_pv">...</span>&nbsp;
                    </span>
                    次，本站总访客数
                    <span
                        id="busuanzi_container_site_uv"
                        style={{ color: "rgba(255,255,255,.9)" }}
                    >
                        &nbsp;<span id="busuanzi_value_site_uv">...</span>&nbsp;
                    </span>
                    人
                </div>
                <div
                    style={{
                        color: "rgba(255,255,255,.4)",
                        textAlign: "center",
                        fontSize: "14px",
                    }}
                >
                    由
                    <a
                        style={{ color: "rgba(255,255,255,.9)" }}
                        href="https://github.com/dongyuanxin/cloudpress"
                        target="_blank"
                    >
                        &nbsp;CLOUDPRESS&nbsp;
                    </a>
                    打造，在线预览
                    <a
                        style={{ color: "rgba(255,255,255,.9)" }}
                        href="https://xxoo521.com/"
                        target="_blank"
                    >
                        &nbsp;DEMO&nbsp;
                    </a>
                </div>
            </Footer>
        </div>
    );
};

export default CustomFooter;
