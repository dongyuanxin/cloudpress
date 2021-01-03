import SeoHead from "./../components/SeoHead/";

export default function Home() {
    return (
        <>
            <SeoHead
                title={"心谭博客"}
                description="心谭博客基于CloudPress构建，它是一款基于云开发的开源博客系统，记录web开发和算法学习。"
            />
            <div className="page-home">
                <div className="page-home-inner">
                    <h1>XinTan's Blog</h1>
                    <p>👨‍💻云开发 Node.js 攻城狮</p>
                    <p>✍️记录 Web 开发和算法学习</p>
                    <p>🌞这是一个开发「萌新」的博客</p>
                    <div className="page-home-btns">
                        <div
                            className="page-home-btn"
                            style={{ background: "#1890ff" }}
                        >
                            <a
                                style={{ color: "white" }}
                                href="https://github.com/dongyuanxin/cloudpress"
                                target="_blank"
                            >
                                开始使用
                            </a>
                        </div>
                        <div className="page-home-btn">
                            <a href="/archives/1" target="_self">
                                进入博客
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
