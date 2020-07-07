import React, { useState, useEffect, useRef } from "react";
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
    Switch,
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
import Darkmode from "darkmode-js";

const { Header } = Layout;

const darkmodeOptions = {
    time: "0.5s", // default: '0.3s'
    saveInCookies: true, // default: true,
    label: "🌓", // default: ''
    autoMatchOsTheme: false, // default: true
};

const Navigation = ({ style }) => {
    const router = useRouter();
    const [searchColWidth, setSearchColWidth] = useState(8);
    const [selectedKeys, setSelectedKeys] = useState([router.route]);
    const [isLightMode, setIsLightMode] = useState(true);
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
    const refDarkmode = useRef(null);

    useEffect(() => {
        refDarkmode.current = new Darkmode(darkmodeOptions);
        setIsLightMode(localStorage.getItem("darkmode") !== "true");
    }, []);

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
                        <Col
                            span={8}
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <Switch
                                style={{
                                    margin: "0 12px",
                                }}
                                checkedChildren="🌝"
                                unCheckedChildren="🌚"
                                checked={isLightMode}
                                onChange={(checked) => {
                                    setIsLightMode(checked);
                                    refDarkmode.current.toggle();
                                }}
                            />
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
                                        display: "inline-flex",
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
