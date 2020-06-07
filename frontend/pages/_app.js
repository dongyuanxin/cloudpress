import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Layout, Menu, Row, Col, Tooltip, Button, Input, Badge } from 'antd'
import { CoffeeOutlined, AppstoreOutlined, CommentOutlined, FireOutlined, BellOutlined, GithubOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Search } = Input

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    const [searchColWidth, setSearchColWidth] = useState(8)
    
    return <Layout>
        <Header style={{background: 'white'}}>
            <Row style={{ width: '1040px', maxWidth: '95vw', margin: '0 auto'}}>
                <Col span={12}>
                    <Menu mode='horizontal'>
                        <Menu.Item key="mail" icon={<CoffeeOutlined />}>
                            简记
                        </Menu.Item>
                        <Menu.Item key="app" icon={<AppstoreOutlined />}>
                            小册
                        </Menu.Item>
                        <Menu.Item key="fw" icon={<CommentOutlined />}>
                            留言
                        </Menu.Item>
                        <Menu.Item key="books" icon={<FireOutlined />}>
                            收藏
                        </Menu.Item>
                        <Menu.Item key="log" icon={<ClockCircleOutlined />}>
                            更新
                        </Menu.Item>
                    </Menu>  
                </Col>  
                <Col span={12}>
                    <Row justify="end" gutter={12}>
                        <Col span={searchColWidth}>
                            <Input placeholder="输入关键词搜索" style={{ borderRadius: '16px' }} suffix={<SearchOutlined style={{ cursor: 'pointer' }}/>}/>
                        </Col>
                        <Col span={8}>
                            <Button type="text">
                                <Badge dot={true}>
                                    <BellOutlined style={{fontSize: '1.4em', fontWeight: 'bold'}}/>
                                </Badge>
                            </Button>
                            <Tooltip placement="top" title="客官，给个Star呗(ง •̀灬•́)ง">
                                <Button type="text" style={{fontSize: '1.4em', fontWeight: 'bold'}}>
                                    <GithubOutlined />
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Header>
        <Content style={{ width: '1040px', maxWidth: '95vw', margin: '0 auto'}}>
            <Component {...pageProps} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            footer neirong
        </Footer>
    </Layout>
}