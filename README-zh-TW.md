<p align="center">
    <img src="doc/demo/logo.png" width="80px" />
    <h1 align="center">Cloud Mail</h1>
    <p align="center">基於 Cloudflare 的簡約響應式信箱服務，支援郵件傳送、附件收發 🎉</p>
    <p align="center">
        <a href="/README.md">簡體中文</a> | <a href="/README-zh-TW.md">繁體中文</a> | <a href="/README-en.md">English</a>
    </p>
    <p align="center">
        <a href="https://github.com/maillab/cloud-mail/tree/main?tab=MIT-1-ov-file" target="_blank" >
            <img src="https://img.shields.io/badge/license-MIT-green" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/releases" target="_blank" >
            <img src="https://img.shields.io/github/v/release/maillab/cloud-mail" alt="releases" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/issues" >
            <img src="https://img.shields.io/github/issues/maillab/cloud-mail" alt="issues" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/stargazers" target="_blank">
            <img src="https://img.shields.io/github/stars/maillab/cloud-mail" alt="stargazers" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/forks" target="_blank" >
            <img src="https://img.shields.io/github/forks/maillab/cloud-mail" alt="forks" />
        </a>
    </p>
    <p align="center">
        <a href="https://trendshift.io/repositories/20459" target="_blank" >
            <img src="https://trendshift.io/api/badge/repositories/20459" alt="trendshift" >
        </a>
    </p>
</p>

## Cursor Skill：sync-upstream

本 fork 在 `.cursor/skills/sync-upstream/` 提供 Cursor Agent Skill，用來同步上游並更新繁體中文翻譯。

### 何時使用

在 Cursor 對話中附加或呼叫 `/sync-upstream`，或說「同步上游」、「sync upstream」、「拉取最新並翻譯」。

### 會自動執行的流程

1. 自動把 `main` branch 的新 change 合過來 `feat/add-zh-TW-i18n`
2. 分析要翻譯的新字串
3. 把新字串翻譯成繁體中文
4. Review 翻譯
5. commit 更改
6. 報告新更新並詢問用戶是否要 deploy 到 Cloudflare
7. 按用戶回答，deploy 到 Cloudflare

> 第 6 步會先詢問，**未得到明確同意前不會 deploy**。

### 前置條件

- 已 checkout / 使用分支 `feat/add-zh-TW-i18n`
- 遠端可取得 `origin/main`（或你追蹤的上游 `main`）
- 若要 deploy：本機已 `wrangler login`，且 `mail-worker/wrangler.toml` 已設定綁定

Skill 檔案路徑：[.cursor/skills/sync-upstream/SKILL.md](.cursor/skills/sync-upstream/SKILL.md)

---

## 專案簡介

只需要一個網域，就可以建立多個不同的信箱，類似各大信箱平台。本專案可部署到 Cloudflare Workers，降低伺服器成本，搭建自己的信箱服務。

## 專案展示

- [線上示範](https://skymail.ink)<br>
- [部署文件](https://doc.skymail.ink)<br>

| ![](/doc/demo/demo1.png) | ![](/doc/demo/demo2.png) |
|-----------------------|-----------------------|
| ![](/doc/demo/demo3.png) | ![](/doc/demo/demo4.png) |

## 功能介紹

- **💰 低成本使用**：可部署到 Cloudflare Workers，降低伺服器成本

- **💻 響應式設計**：響應式版面自動適配 PC 與大部分手機瀏覽器

- **📧 郵件傳送**：整合 Resend 傳送郵件，支援群發、內嵌圖片與附件，可查看傳送狀態

- **🛡️ 管理員功能**：可管理使用者與郵件，RBAC 權限控制功能與資源使用上限

- **📦 附件收發**：支援收發附件，使用 R2 物件儲存保存與下載檔案

- **🔔 郵件推送**：收到郵件後可轉發到 TG 機器人或其他服務商信箱

- **📡 開放 API**：支援使用 API 批次產生使用者、多條件查詢郵件

- **🔢 驗證碼辨識**：使用 Workers AI，自動辨識郵件驗證碼

- **📈 資料視覺化**：使用 ECharts 呈現系統資料與使用者／郵件成長

- **🎨 個人化設定**：可自訂網站標題、登入背景、透明度

- **🤖 人機驗證**：整合 Turnstile 人機驗證，防止批量註冊

- **📜 更多功能**：持續開發中...

## 技術棧

- **平台**：[Cloudflare Workers](https://developers.cloudflare.com/workers/)

- **Web 框架**：[Hono](https://hono.dev/)

- **ORM：**[Drizzle](https://orm.drizzle.team/)

- **前端框架**：[Vue3](https://vuejs.org/)

- **UI 框架**：[Element Plus](https://element-plus.org/)

- **郵件推送：** [Resend](https://resend.com/)

- **快取**：[Cloudflare KV](https://developers.cloudflare.com/kv/)

- **資料庫**：[Cloudflare D1](https://developers.cloudflare.com/d1/)

- **檔案儲存**：[Cloudflare R2](https://developers.cloudflare.com/r2/)

## 目錄結構

```
cloud-mail
├── mail-worker				    # worker 後端專案
│   ├── src
│   │   ├── api	 			    # api 介面層
│   │   ├── const  			    # 專案常數
│   │   ├── dao                 # 資料存取層
│   │   ├── email			    # 郵件處理／接收
│   │   ├── entity			    # 資料庫實體
│   │   ├── error			    # 自訂例外
│   │   ├── hono			    # web 框架設定、攔截器、全域例外等
│   │   ├── i18n			    # 語言國際化
│   │   ├── init			    # 資料庫／快取初始化
│   │   ├── model			    # 回應體資料封裝
│   │   ├── security			# 身分權限認證
│   │   ├── service			    # 業務服務層
│   │   ├── template			# 訊息範本
│   │   ├── utils			    # 工具類
│   │   └── index.js			# 入口檔案
│   ├── package.json			# 專案依賴
│   └── wrangler.toml			# 專案設定
│
├── mail-vue				    # vue 前端專案
│   ├── src
│   │   ├── axios 			    # axios 設定
│   │   ├── components			# 自訂元件
│   │   ├── echarts			    # echarts 元件匯入
│   │   ├── i18n			    # 語言國際化
│   │   ├── init			    # 入站初始化
│   │   ├── layout			    # 主體版面元件
│   │   ├── perm			    # 權限認證
│   │   ├── request			    # api 介面
│   │   ├── router			    # 路由設定
│   │   ├── store			    # 全域狀態管理
│   │   ├── utils			    # 工具類
│   │   ├── views			    # 頁面元件
│   │   ├── app.vue			    # 入口元件
│   │   ├── main.js			    # 入口 js
│   │   └── style.css			# 全域 css
│   ├── package.json			# 專案依賴
└── └── env.release				# 專案設定
```

## 贊助

<a href="https://doc.skymail.ink/support.html" >
<img width="170px" src="./doc/images/support.png" alt="">
</a>

## 授權條款

本專案採用 [MIT](LICENSE) 授權條款

## 交流

[Telegram](https://t.me/cloud_mail_tg)
