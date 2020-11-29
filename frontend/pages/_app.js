import "antd/dist/antd.css";
import React, { useState } from "react";
import { Layout, BackTop } from "antd";
import CustomFooter from "./../components/CustomFooter/";
import Navigation from "./../components/Navigation/";
import Head from "next/head";
import "./../styles/index.scss";
import "highlight.js/styles/atom-one-light.css";

const { Content } = Layout;

// if (process.browser) {
//     const targetProtocol = "https:";
//     if (
//         process.env.NODE_ENV !== "development" &&
//         window.location.protocol !== targetProtocol
//     ) {
//         window.location.href =
//             targetProtocol + window.location.href.slice(targetProtocol.length);
//     }
// }

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
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
