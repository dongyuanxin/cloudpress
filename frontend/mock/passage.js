import axios from "axios";

export async function fetchPassage() {
    return {
        passage: `
# CloudPress: 基于云开发的新一代内容建站工具

<!-- 我是注释 -->

我是一个脚注[^1]， 这是另一个[^longnote]。

[^1]: 这是第一个脚注释

[^longnote]: 这是另一个脚注释

> 我是一段引用
>
> Tencent CloudBase 在内容领域应用解决方案的最佳实践。

### 技术栈

- **前端**：\`Next.js\` + \`Antd\`
- **后端**：\`NestJS\` + 云容器
- **数据库**：云数据库 + \`CMS\`
- **存储**：云存储 + 静态网站托管

::: warning 警告

这是一条“告警”消息

:::

::: error 错误

这是一条“错误”消息

:::

::: tip 提醒

这是一条“提醒”消息

:::

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

- [ ] hello
- [x] 支持 Shallow routing

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

## 二级标题

我是二级标题。。。

### 三级标题

我是三级标题。。。

#### 四级标题

我是四级标题。。。

##### 五级标题

我是五级标题。。。

| 名称 | 属性 | 
| -- | -- |
| 董 | 沅鑫 |
| 唱哼哼 | 常恒恒 | 
| right-aligned | right-aligned |

![](https://6f66-offcial-site-cms-15fc4b-1258016615.tcb.qcloud.la/hotfix/008.jpg)

`,
    };
}
