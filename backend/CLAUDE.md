# backend (Rails API)

Ruby 3.4.7 / Rails 8.1(API モード) / PostgreSQL / pundit / blueprinter / pagy / jwt + bcrypt / rspec

## コマンド
- `bin/rails s` / `bin/rails db:migrate` / `bin/rails c`
- `bundle exec rspec`(単体: `bundle exec rspec spec/requests/api/xxx_spec.rb`)
- `bin/rubocop`(rubocop-rails-omakase。配列は `[ a, b ]` と内側にスペース)
- `bin/brakeman` / `bin/bundler-audit` / `bin/ci`(CI と同じチェック)

## ディレクトリ構成
- `app/controllers/api/` : API コントローラ。ネストしたリソースは `api/monthly_plans/` のように `Api::MonthlyPlans::XxxController`
- `app/controllers/concerns/authenticatable.rb` : JWT 認証
- `app/models/` / `app/policies/`(Pundit) / `app/serializers/`(Blueprinter)
- `lib/json_web_token.rb` : JWT のエンコード/デコード
- **services 層は無い**。ビジネスロジックはモデルのメソッドに書き、複数テーブル更新はトランザクション内で行う(例: `MonthlyPlan#save_with_details!`)

## ルーティング
- すべて `namespace :api` 配下。ネストしたサブリソースは `scope module: :monthly_plans` と単数 `resource` を使う。

## コントローラ規約
- `class Api::XxxController < ApplicationController`(コンパクト記法)
- `ApplicationController` で `before_action :authorize_request` が全体に掛かる。認証不要なものだけ `skip_before_action :authorize_request, only: [...]`
- 認可は Pundit。`authorize record`、ネストは `policy_scope(Model).find(...)`
- ストロングパラメータは `params.expect(budget_item: [:name, :type])`
- 更新系は `save!` / `update!` / `destroy!`(bang)を使い、失敗は `rescue_from` に任せる
- レスポンスは `XxxSerializer.render_as_json(obj)` を `render json:` に渡し、`status:` を明示(`:ok` / `:created`)。中身が無い更新は `render json: {}, status: :ok`
- ページネーションは `Pagy::Method` + `PaginationSerializer`

## エラーレスポンス
- 形式は `{ error: { code, message, detail? } }`。`code` は snake_case、`message` は日本語。
- `ApplicationController` の `render_bad_request` / `render_forbidden_error` / `render_not_found` / `render_conflict` / `render_unprocessable_entity` を使う。
- **新規コードは必ずこの形式に従う**。`AuthController` の `{ errors: [...] }` や `{ error: "文字列" }`、`Authenticatable#render_unauthorized` の空 `{}` は踏襲しない。

## モデル規約
- `validates` は 1 属性 1 行(presence / length / `uniqueness: { scope: :user_id }`)
- enum は文字列値でキーと値を同名にし、日本語コメントを付ける: `enum :account_type, { cash: "cash", ... }, default: :cash`
- `type` カラムを使うときは `self.inheritance_column = :_type_disabled`
- 関連は `with_options dependent: :destroy do ... end` でまとめる
- コールバックで拒否するときは `errors.add(:base, "...")` + `throw :abort`
- scope はキーワード引数: `scope :available_items, ->(user:) { ... }`
- データは必ず `user` に紐づけ、他ユーザーのデータが見えないようにする

## Serializer
- `Blueprinter::Base` を継承し `identifier :id` + `fields ...`。計算値は `field :xxx do |obj| ... end`。ファイル名は `xxx_serializer.rb`

## テスト (RSpec)
- 中心は **request spec**(`spec/requests/api/...`)。パスは `/api/...` を直書きする。ほかに `spec/models` / `spec/policies` / `spec/lib`
- 書き方: `describe "#index"` の中に `subject { get "/api/budget_items" }`、`context "ログイン済みの場合"`、`it "200と〜を返す"`(説明は日本語)
- 認証は `spec/support/auth_helper.rb` の `login_as(user)`。未ログインは `it_behaves_like 'requires authentication'`
- データは FactoryBot(`spec/factories/`)+ Faker、`let!` で `create(:xxx, user:)`
- レスポンスは `response.parsed_body` を `eq` で完全一致検証
- **他ユーザーのデータが返らないこと**も必ず確認する

## ドメイン
Profile / Occupation / Prefecture(マスタ) / BudgetItem / MonthlyPlan / MonthlyPlanDetail / HouseholdBudget / AssetAccount / AssetBalance / User
