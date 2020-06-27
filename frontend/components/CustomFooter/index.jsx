import { useState } from 'react'
import { Row, Col, Layout, Divider } from 'antd'

const { Footer } = Layout

const CustomFooter = ({ style }) => {
    const cols = [
        {
            name: '帮助',
            items: [
                {
                    name: '源码地址',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: '意见反馈',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: '常见问题',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: '更新日志',
                    url: 'https://xxoo521.com/'
                }
            ]
        },
        {
            name: '技术栈',
            items: [
                {
                    name: 'Ant Design',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: 'Next.js',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: 'NestJS',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: '云开发',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: 'Travis',
                    url: 'https://xxoo521.com/'
                }
            ]
        },
        {
            name: '其他平台',
            items: [
                {
                    name: 'Github',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: 'junjin.im',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: 'SegmentFault',
                    url: 'https://xxoo521.com/'
                },
                {
                    name: 'xin-tan.com',
                    url: 'https://xxoo521.com/'
                }
            ]
        }
    ]

    const rendersCols = () => {
        const colSpan = Math.floor(24 / cols.length)

        const renderItems = (items = []) => {
            return items.map((item, index) => (
                <Row key={index} style={{margin: '12px 0'}}>
                    <a style={{color: 'rgba(255,255,255,.9)'}} href={item.url}>{item.name}</a>
                </Row>
            ))
        }

        return <Row gutter={24}>
            {
                cols.map((col, index) => (<Col key={index} span={colSpan}>
                    <h2 style={{color: 'rgba(255,255,255,.9)', marginBottom: '24px', fontSize: '16px'}}>
                        {col.name}
                    </h2>
                    {renderItems(col.items)}
                </Col>))
            }
        </Row>
    }

    return (
        <div style={{ background: '#000'}}>
            <Footer style={{ ...style, background: '#000', padding: '24px 0'}}>
                {rendersCols()}
                <Divider style={{borderTopColor: 'rgba(255,255,255,.4)'}}/>
                <div style={{color: 'rgba(255,255,255,.4)', textAlign: "center", fontSize: '16px'}}>
                    Made with 
                    <span style={{color: 'rgb(255, 255, 255)'}}>&nbsp;❤&nbsp;</span>
                    by
                    <span style={{color: 'rgba(255,255,255,.9)'}}>&nbsp;CloudPress</span>
                </div>
            </Footer>
        </div>
    )
}

export default CustomFooter