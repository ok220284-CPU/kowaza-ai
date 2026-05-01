# KOWAZA AI

ソフトボール小技 AI コーチ。動画をアップするだけで、Gemini 2.5 Pro が打者のフォームを診断します。

## 対応技

- スラップ（革ボール／ゴムボール）
- セーフティバント
- バスター
- プッシュ

## URL

`https://kowaza-ai.pages.dev`

## 必要な設定

### Cloudflare Pages 環境変数

- `GEMINI_API_KEY`：Gemini API キー

### GitHub Actions Secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 開発

`functions/api/analyze.js` で各技の理想フォームと判定軸を定義。新しい技を追加するときはここに追記する。
