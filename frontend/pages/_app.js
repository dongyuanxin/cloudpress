import "antd/dist/antd.css";
import React, { useEffect } from "react";
import { Layout, BackTop } from "antd";
import CustomFooter from "./../components/CustomFooter/";
import Navigation from "./../components/Navigation/";
import Head from "next/head";
import "./../styles/index.scss";
import "highlight.js/styles/atom-one-light.css";

const { Content } = Layout;

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if(window.navigator && navigator.serviceWorker) {
            navigator.serviceWorker.getRegistrations()
                .then(function(registrations) {
                    for(let registration of registrations) {
                        registration.unregister()
                    }
                })
          }
    }, [])
    return (
        <Layout style={{ background: "white" }}>
            {/* todo: 移动端兼容 */}
            <Head>
                <meta
                    name="viewport"
                    content="width=1024, user-scalable=yes, initial-scale=1"
                />
                <link
                    rel="sitemap"
                    type="application/xml"
                    title="Sitemap"
                    href="/sitemap.xml"
                />
            </Head>
            <Navigation style={{ background: "white" }} />
            <Content
                style={{
                    width: "1040px",
                    maxWidth: "95vw",
                    margin: "0 auto",
                    minHeight: "calc(100vh - 64px - 307px)",
                }}
            >
                <Component {...pageProps} />
            </Content>
            <CustomFooter
                style={{ width: "1040px", maxWidth: "95vw", margin: "0 auto" }}
            />
            <BackTop style={{ right: "50px" }}></BackTop>
        </Layout>
    );
}
