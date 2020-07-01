import "antd/dist/antd.css";
import React, { useState } from "react";
import { Layout } from "antd";
import CustomFooter from "./../components/CustomFooter/";
import Navigation from "./../components/Navigation/";
import "./../styles/index.scss";
import "highlight.js/styles/atom-one-light.css";

const { Content } = Layout;

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return (
        <Layout style={{ background: "white" }}>
            <Navigation style={{ background: "white" }} />
            <Content
                style={{
                    width: "1040px",
                    maxWidth: "95vw",
                    margin: "0 auto",
                    minHeight: "calc(100vh - 64px - 340px)",
                }}
            >
                <Component {...pageProps} />
            </Content>
            <CustomFooter
                style={{ width: "1040px", maxWidth: "95vw", margin: "0 auto" }}
            />
        </Layout>
    );
}
