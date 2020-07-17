import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="zh">
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                    <script
                        async
                        src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
                    ></script>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
