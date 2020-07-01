import React, { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Row,
    Col,
    Tooltip,
    Button,
    Input,
    Badge,
    message,
} from "antd";
import { useRouter } from "next/router";
import {
    CoffeeOutlined,
    AppstoreOutlined,
    CommentOutlined,
    FireOutlined,
    BellOutlined,
    GithubOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from "./../../components/Icon/";

const { Header } = Layout;

const Navigation = ({ style }) => {
    const router = useRouter();
    const [searchColWidth, setSearchColWidth] = useState(8);
    const [selectedKeys, setSelectedKeys] = useState([router.route]);
    const nav = [
        {
            title: "首页",
            key: "/",
            icon: <HomeOutlined />,
            disabled: false,
            link: "/",
        },
        {
            title: "简记",
            key: "/archives/[page]",
            icon: <CoffeeOutlined />,
            disabled: false,
            link: "/archives/1/",
        },
        {
            title: "小册",
            key: "xiaoce",
            icon: <AppstoreOutlined />,
            disabled: true,
        },
        {
            title: "留言",
            key: "liuyan",
            icon: <CommentOutlined />,
            disabled: true,
        },
        {
            title: "更新",
            key: "gengxin",
            icon: <ClockCircleOutlined />,
            disabled: true,
        },
    ];

    return (
        <Header style={style}>
            <Row
                style={{ width: "1040px", maxWidth: "95vw", margin: "0 auto" }}
            >
                <Col span={12}>
                    <Menu
                        mode="horizontal"
                        selectedKeys={selectedKeys}
                        style={{
                            borderColor: "transparent",
                            fontWeight: "bold",
                        }}
                    >
                        {nav.map((item) => (
                            <Menu.Item
                                key={item.key}
                                icon={item.icon}
                                onClick={() =>
                                    item.disabled &&
                                    message.warning("业务需求多，下班熬夜肝")
                                }
                            >
                                {item.link ? (
                                    <a href={item.link} target="_self">
                                        {item.title}
                                    </a>
                                ) : (
                                    <span>{item.title}</span>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu>
                </Col>
                <Col span={12}>
                    <Row justify="end" gutter={12}>
                        <Col span={searchColWidth}>
                            <Input
                                placeholder="输入关键词搜索"
                                style={{ borderRadius: "16px" }}
                                suffix={
                                    <SearchOutlined
                                        style={{ cursor: "pointer" }}
                                    />
                                }
                            />
                        </Col>
                        <Col span={8}>
                            <Button type="text">
                                <Badge dot={true}>
                                    <BellOutlined
                                        style={{
                                            fontSize: "1.4em",
                                            fontWeight: "bold",
                                        }}
                                    />
                                </Badge>
                            </Button>
                            <Tooltip
                                placement="top"
                                title="客官，给个Star呗(ง •̀灬•́)ง"
                            >
                                <Button
                                    type="text"
                                    style={{
                                        fontSize: "1.4em",
                                        fontWeight: "bold",
                                    }}
                                    onClick={() =>
                                        window.open(
                                            "https://github.com/dongyuanxin/cloudpress",
                                            "_blank"
                                        )
                                    }
                                >
                                    <GithubOutlined />
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Header>
    );
};

export default Navigation;
