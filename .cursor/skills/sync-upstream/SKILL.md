---
name: sync-upstream
description: >-
  Syncs upstream main into feat/add-zh-TW-i18n, finds new i18n strings, translates
  them to Traditional Chinese (zh-TW), reviews, commits, then asks before Cloudflare
  deploy. Use when the user says sync-upstream, sync upstream, 同步上游, 拉取最新並翻譯,
  or wants to merge main and update zh-TW translations.
disable-model-invocation: true
---

# sync-upstream

Sync upstream `main` into the Traditional Chinese feature branch, translate new strings, commit, then optionally deploy.

## Workflow (execute in order)

1. 自動把main branch的新change合過來feat/add-zh-TW-i18n
2. 分析要翻譯的新字串
3. 把新字串翻譯成繁體中文
4. Review翻譯
5. commit更改
6. 報告新更新並詢問用戶是否要deploy到cloudflare
7. 按用戶回答, deploy到cloudflare

Do **not** skip step 6 — never deploy until the user explicitly answers yes.

## Step details

### 1. Merge main → feat/add-zh-TW-i18n

```bash
git fetch origin main
git checkout feat/add-zh-TW-i18n
git merge origin/main
```

- Resolve conflicts carefully; prefer keeping zh-TW wiring (`'zh-TW'` keys, locale branches) when both sides change i18n registration.
- If merge is clean with no i18n/source string changes, still run step 2 to confirm, then report “無需新翻譯” and skip to step 6 only if there is nothing to commit (or commit empty? — no: skip commit, go to report).

### 2. Analyze strings needing translation

Compare keys between source dictionaries and zh-TW:

| Package | Source | Target |
|---------|--------|--------|
| Frontend | `mail-vue/src/i18n/zh.js` (also check `en.js` for new keys) | `mail-vue/src/i18n/zh-TW.js` |
| Worker | `mail-worker/src/i18n/zh.js` | `mail-worker/src/i18n/zh-TW.js` |

Find:

- Keys in `zh` / `en` missing from `zh-TW`
- Orphan keys in `zh-TW` removed upstream (delete them)
- Nested objects (e.g. worker `perms`) — keys that are Simplified Chinese identifiers must stay as keys; only translate **values**

Also scan wiring if upstream touched locale switches (`=== 'zh'`, element-plus, dayjs, tinymce, accept-language).

### 3. Translate to Traditional Chinese

- Style: **台灣在地化** (設定 / 訊息 / 檔案 / 網路 / 登入 / 帳戶 / 重設 …), not pure OpenCC.
- Keep placeholders intact: `{msg}`, `{total}`, `{{msg}}`, HTML fragments.
- Do not invent keys; mirror `zh.js` structure exactly.

### 4. Review translations

Before commit, verify:

- [ ] FE/BE key parity with `zh` (no missing / no extras)
- [ ] No Simplified-only glyphs leaked into **values**
- [ ] Placeholders and punctuation preserved
- [ ] Worker `perms` object: SC **keys** unchanged, TW **values** OK

### 5. Commit

Only when there are translation (or merge conflict-resolution) file changes:

- Follow repo commit style (`feat:` / `fix:` / `sync:` / `chore:`)
- Do **not** commit secrets (`jwt_secret` in `wrangler.toml`), `.omc/`, or unrelated lockfile noise
- If user did not ask to commit in other contexts, this skill **does** authorize the step-5 commit as part of the workflow

### 6. Report and ask

Report in Traditional Chinese:

- Merged commits / notable upstream changes
- New/updated/removed i18n keys (counts + short list)
- Commit hash(es)

Then **ask**:

> 是否要 deploy 到 Cloudflare？

Wait for the user. Do not proceed to step 7 on silence.

### 7. Deploy (only if user says yes)

From `mail-worker`:

```bash
pnpm install   # if node_modules missing
npx wrangler deploy
```

- Confirm `wrangler whoami` succeeds first
- Do not put `jwt_secret` into git; rely on `keep_vars = true` on CF if commented locally
- After deploy, report Worker URL and version id

If user says no / later / skip — stop cleanly after step 6.

## Project anchors

- Feature branch: `feat/add-zh-TW-i18n`
- Upstream track: `origin/main`
- Deploy config: `mail-worker/wrangler.toml`
- Deploy cwd: `mail-worker`
- Prior deep-dive: `.omc/specs/deep-dive-add-traditional-chinese-language.md` (if present)

## Abort conditions

- Merge conflicts the agent cannot resolve safely → stop and ask the user
- Wrangler not logged in on deploy → stop and ask user to `wrangler login`
- Same deploy error 3 times → stop and report
