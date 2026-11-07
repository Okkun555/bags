# frontend (React)

React 19 / Vite 8 / TypeScript / react-router 8 / SWR + axios / MUI v9 / react-hook-form + zod 4 / dayjs / humps

## コマンド
- `npm run dev` / `npm run build`(`tsc -b && vite build`) / `npm run lint`(oxlint) / `npm run preview`
- テストと formatter は未導入。変更後は `npm run build` と `npm run lint` を通す。

## TypeScript 制約
- `@/` は `src/` のエイリアス。import は `@/...` の絶対パスを基本とする。
- `verbatimModuleSyntax` : 型の import は `import type` / `type` 修飾が必須。
- `erasableSyntaxOnly` : `enum` / `namespace` は使えない。`as const` の配列や `z.enum` で代替する。
- 型は `type` エイリアスで書く(`interface` は使わない)。

## ディレクトリ構成 (`src/`)
- `routes/` : `Routes.tsx`(ルート定義)、`paths.ts`、`GuestRoute` / `ProtectedRoute`
- `providers/AuthProvider.tsx` : 認証状態。参照は `useAuth()`
- `libs/api/client.ts` : axios インスタンスと `fetcher` / `postRequest` / `putRequest` / `deleteRequest` / `postRequestWithFile`
- `repositories/` : API 呼び出し(SWR フック)。`paths.ts` にバックエンドのパス定義
- `types/` : ドメイン別の型。レスポンス共通型は `apiResponse.ts`(`GetListWithPagination<T>` 等)
- `components/` : 画面とコンポーネント。`pages/` ディレクトリは無く、ルートの element には機能の最上位コンポーネントを直接割り当てる

## コンポーネント規約
- `components/<機能>/<Name>/` に **1 コンポーネント 1 ディレクトリ**。`Name.tsx` + `useName.ts`(ロジック/フォーム) + `index.ts`(バレル)
- 子コンポーネントは親のディレクトリの下にネストする(例: `MonthlyPlanList/AddMonthlyPlanDialog/`)
- named export + `FC<Props>`。`type Props = {...}` は同ファイルに置く(default export は `App` / `Routes` のみ)
- 共通部品は `components/shared/`、レイアウトは `XxxLayout.tsx`(`Outlet` を使う)
- スタイルは MUI の `sx` / `Box component` を基本とする

## API 層 (`repositories/`)
- `repositories/<ドメイン>/xxxRepository.ts` に書く。命名は `useFetchXxx`(一覧) / `usePostXxx` / `useDeleteXxx`。ドメイン名付きの値を返す(`{ budgetItems, isLoading }` / `{ createBudgetItem, isMutating }`)
- 変更系は `useSWRMutation<Data, Error, Key, Arg>`。成功時に `onSuccess: () => mutate(一覧のキー)` で再検証する
- SWR のキーはバックエンドのパス文字列をそのまま使う。パスは `repositories/paths.ts` の `backendPaths` で一元管理(先頭 `/` を忘れない。動的なものは `(id: number) => ...`)
- **新規コードは `*Repository.ts` 形式に従う**。旧形式の `useBudgetItem.ts` / `useMonthlyPlan.ts` / `useSignupApi.ts` などは踏襲しない。
- リクエストは snake_case、レスポンスは camelCase に自動変換される。フロントのコードは常に camelCase で書く。

## ルーティング
- ルート定義は `routes/Routes.tsx` に集約。認証は `GuestRoute`(未ログイン専用) / `ProtectedRoute`(ログイン必須、プロフィール未登録なら `/profile/new` へ)のレイアウトルートで制御する。
- 画面パスは `routes/paths.ts` に `as const` で定義する。動的パスは関数(`monthlyPlanShow(id)`)とルート用パターン(`monthlyPlanShowPattern`)の 2 本立て。
- **パス定義は `routes/paths.ts` に一本化する**。`components/routes/paths.ts` は新規に使わない。ベースパスのハードコードもしない。

## フォーム
- react-hook-form + zod + MUI(`Controller` + `TextField` / `Select`)。
- ロジックはコンポーネント隣の `useXxx.ts` に置く。`schema` と `XxxForm` 型(`z.infer<typeof schema>`)を定義し、`{ control, handleSubmit, errors, onSubmit }` を返す。
- **`useForm` には必ず `resolver: zodResolver(schema)` を付ける**(付け忘れるとスキーマが検証に使われない)。
- zod のエラーメッセージは日本語(`{ message: "..." }`)。エラー表示は `error={!!errors.x}` / `helperText={errors.x?.message}`。
- 送信は `handleSubmit(onSubmit)` の中で `await trigger(data)` してからダイアログを閉じる。

## その他
- 日付は dayjs(`dayjs/locale/ja`、MUI は `AdapterDayjs`)。
- UI 文言・コメントは日本語。コメントは `/** ... */` か `// MEMO:`。
- ファイル名・識別子の綴りに注意する(例: `Account` を `Acount` と書かない)。
