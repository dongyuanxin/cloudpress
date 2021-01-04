import React, { useState, useEffect, useRef } from "react";
import {
    Layout,
    Menu,
    Row,
    Col,
    Tooltip,
    Button,
    Badge,
    message,
    Switch,
    Drawer,
    Timeline,
} from "antd";
import { useRouter } from "next/router";
import {
    CoffeeOutlined,
    AppstoreOutlined,
    CommentOutlined,
    BellOutlined,
    GithubOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from "./../../components/Icon/";
import SearchInput from "./../../components/SearchInput";
import { NoticeReq } from "./../../requests/notice";
import { TimesReq } from './../../requests/times'
import { formatISOString } from "./../../helpers/utils";
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
    const startTimeKey = "noticeStartTime";
    const [isLightMode, setIsLightMode] = useState(true);
    const [notices, setNotices] = useState([]);
    const [unReadNoticeCount, setUnreadNoticeCount] = useState(0);
    const [noticeDrawerVisible, setNoticeDrawerVisible] = useState(false);
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
            link: "/archives/1",
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
        // 防止每次都渲染 Darkmode.js，它没做单例优化
        refDarkmode.current = new Darkmode(darkmodeOptions);
        setIsLightMode(localStorage.getItem("darkmode") !== "true");

        TimesReq.view(router.asPath)
        getNotices();
    }, []);

    // 获取未读消息
    const getNotices = async () => {
        let startTime = parseInt(localStorage.getItem(startTimeKey), 10);
        if (isNaN(startTime)) {
            // 默认拉取过去2个月的未读消息
            startTime = Date.now() - 1000 * 60 * 60 * 24 * 60;
        }

        const { notices } = await NoticeReq.getNotices({
            size: 100,
            startTime,
        });
        setNotices(notices);
        setUnreadNoticeCount(notices.length);
    };

    // 渲染通知视图
    const renderNotices = () => {
        // 设置全部已读
        const readAllNotices = () => {
            // 全部已读后，不可回退
            if (unReadNoticeCount === 0) {
                return;
            }
            // 更新未读消息数量
            setUnreadNoticeCount(0);
            // 使用最新消息的时间作为开始时间戳
            localStorage.setItem(
                startTimeKey,
                new Date(notices[0].noticeTime).getTime()
            );
        };

        const noticeNodes = [];

        for (const notice of notices) {
            noticeNodes.push(
                <Timeline.Item
                    label={formatISOString(notice.noticeTime)}
                    key={notice._id}
                    color={unReadNoticeCount === 0 ? "blue" : "gray"}
                >
                    <h4>{notice.noticeTitle}</h4>
                    <p>{notice.noticeContent}</p>
                </Timeline.Item>
            );
        }
        noticeNodes.push(
            <Timeline.Item color="gray" key="last-notice">
                <p style={{ color: "gray" }}>没有更多了</p>
            </Timeline.Item>
        );

        return (
            <Drawer
                title={
                    <Switch
                        checkedChildren="全部已读"
                        unCheckedChildren="未读消息"
                        checked={unReadNoticeCount === 0}
                        onChange={readAllNotices}
                    />
                }
                placement="right"
                closable={true}
                onClose={() => setNoticeDrawerVisible(false)}
                visible={noticeDrawerVisible}
                key="notice-drawer-right"
                width={350}
            >
                <Timeline mode="left">{noticeNodes}</Timeline>
            </Drawer>
        );
    };

    return (
        <Header style={style}>
            {renderNotices()}
            <Row
                style={{ width: "1040px", maxWidth: "95vw", margin: "0 auto" }}
            >
                <Col span={12}>
                    <Menu
                        mode="horizontal"
                        selectedKeys={[router.route]}
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
                        <Col span={8}>
                            <SearchInput />
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
                            <Button
                                type="text"
                                onClick={() => {
                                    // 如果有新通知，打开视图
                                    if (notices.length) {
                                        setNoticeDrawerVisible(true);
                                    } else {
                                        message.info("没有新消息");
                                    }
                                }}
                            >
                                <Badge
                                    count={unReadNoticeCount}
                                    overflowCount={10}
                                >
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
                                            "https://github.com/dongyuanxin/blog",
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
