# bags

家計簿・資産管理アプリ。モノレポ構成。

- `backend/` : Rails 8 API モード(詳細は `backend/CLAUDE.md`)
- `frontend/` : React + Vite SPA(詳細は `frontend/CLAUDE.md`)

作業するディレクトリの CLAUDE.md に必ず従うこと。

## 起動手順
1. `cp .env.example .env`(POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB を設定)
2. `docker compose up -d db`(PostgreSQL 16、ホスト側ポートは **5435**)
3. backend: `cd backend && bin/rails db:prepare && bin/rails s`(:3000)
4. frontend: `cd frontend && npm install && npm run dev`

compose に含まれるのは DB のみ。backend / frontend はローカルで起動する。

## 全体共通のルール
- 認証は httponly Cookie の JWT。frontend は `withCredentials: true` で `VITE_API_URL`(`http://localhost:3000/api`)に直接アクセスする(dev proxy なし、CORS は Rails 側で許可)。
- API の JSON キーは backend が snake_case、frontend は camelCase。変換は `frontend/src/libs/api/client.ts` で humps により自動で行う。
- コード中のコメント、UI 文言、エラーメッセージ、テストの説明文は **日本語** で書く。
- API を追加・変更するときは backend(routes / controller / serializer / spec)と frontend(`repositories/paths.ts` / repository / types)の両側を揃える。
