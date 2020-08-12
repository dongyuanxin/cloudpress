# CloudPress: 基于云开发的开源博客系统

## 快速开始

1. **创建腾讯云账号**: 前往[腾讯云官网](https://cloud.tencent.com/)

2. **开通 CloudBase**：前往[TCB 控制台](https://console.cloud.tencent.com/tcb/env/index)

3. **新建云开发环境**：根据需要选择付费策略，每个用户都可以创建「免费环境」

4. **开通内容管理**：进入新创建的云开发环境，开通「内容管理」，等待 5 分钟左右

5. **获取云环境 ID、访问密钥**：进入新创建的云开发环境，获取环境 ID；进入[访问密钥](https://console.cloud.tencent.com/cam/capi)，获取`SecretId`和`SecretKey`。

6. **环境搭建**

-   全局安装 CloudBase CLI 和 Next.js

```bash
npm i -g @cloudbase/cli next
```

-   从 GIT 下载代码

```bash
git clone https://github.com/dongyuanxin/cloudpress.git
```

7. **设置配置文件**

```bash
cd cloudpress/
touch .env
```

配置文件格式：

```bash
ENV_ID=你的云环境ID
TCB_SECRET_ID=你的访问密钥SecretId
TCB_SECRET_KEY=你的访问密钥SecretKey
```

复制一份配置文件到`frontend/`：

```bash
cp .env frontend/.env
```

8. **初始化数据表**

```bash
npm run login # CLI 登录 CloudBase
npm run init:db # 初始化数据表结构，包括文章、通知、全局配置等
```

9. **部署发布**

```bash
npm run deploy:frontend
```

10. **本地开发**

```bash
cd ./frontend
npm run dev
```
