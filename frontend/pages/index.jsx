import Head from 'next/head'
import { Button } from 'antd'

export default function Home() {
    return (
        <div className="page-home">
            <div className="page-home-inner">
                <h1>CloudPress&nbsp;&nbsp;&nbsp;基于云</h1>
                <p>✍️一款基于云开发的开源博客系统</p>
                <div className="page-home-btns">
                    <div className="page-home-btn" style={{background: "#1890ff"}}>
                        <a style={{color: 'white'}} href="https://github.com/dongyuanxin/cloudpress" target="_blank">开始使用</a>
                    </div>
                    <div className="page-home-btn">
                        <a href="/archives/1" target="_self">进入博客</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
