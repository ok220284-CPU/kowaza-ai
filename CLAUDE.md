# Claude への申し送り

## 絶対ルール

### 1. URLは絶対に変えない
- Cloudflare Pages の `project_name` = `kowaza-ai`
- URL: `kowaza-ai.pages.dev`

### 2. リポジトリは非公開維持
- private: true を必ず保つ

### 3. 設定の場所
- `.github/workflows/deploy.yml` の `project-name` 引数

## こーた との進め方

- 日本語で対応
- 「簡単」「すぐ」「だけ」みたいな言葉は使わない
- スクショは負担なので何度も求めない
- 慌てず、ひとつずつ確実に

## 環境変数（Cloudflare Pages dashboard で設定）

- `GEMINI_API_KEY`：Gemini API キー（動画解析用）

## 必要な GitHub Actions Secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` = `7236d591bcc2a40c3032d6aea2f1bab4`

## 報告ルール

- 機能変更したら必ず公開URL `https://kowaza-ai.pages.dev` をレスポンスに含める
