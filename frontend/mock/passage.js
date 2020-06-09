import axios from 'axios'

export async function fetchPassage() {
    return {
        passage: `
# 05/30 【Next.js】路由以及高级用法

<!-- 我是注释 -->

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

### 路由
- 支持动态路由
- 提供了 \`next/link\` 库
- 支持 Shallow routing

::: warning 

*here be dragons* 

:::

- [ ] hello
- [x] 支持 Shallow routing

\`\`\`html
<script>
  console.log("hello world!")
</script>
\`\`\`

\`\`\`javascript
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";

const HomePage = () => {
    const router = useRouter();
    useEffect(() => {
    router.push("/home?counter=10", undefined, { shallow: true });
    }, []);

    useEffect(() => {
    // The counter changed!
    }, [router.query.counter]);

    return (
    <div>
        <div>Home Page!</div>
        <Link href="/posts/[id]" as="/posts/1">
        <a>跳转到动态路由</a>
        </Link>
        <Link href="/blog">
        <a>next/router的Link标签：Blog</a>
        </Link>
        

        <a href="/blog" target="_self">
        普通a标签：Blog
        </a>
        <button onClick={() => Router.push("/blog")}>
        next/router编程式跳转：Blog
        </button>
    </div>
    );
};

export default HomePage;
\`\`\`
注意：

- 对于 \`next/link\` 来说，既可以在page中使用useRouter返回obj，也可以直接使用Router。
- 对于 \`next/link\` 来说，as用于动态路由跳转
- 动态路由的id信息和浏览器中路由参数的信息，都在 \`router.query\` 中（这地方设计不是太规范）

默认页面：

- \`_app.js\` 
- \`_document.js\` 
- \`_error.js\` 

默认组件： \`<Head>\` 

这些都可以根据情况自定义，尤其是 \`Head\` ，可以优化不同页面的seo。

`
    }
}