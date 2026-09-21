require 'rails_helper'

RSpec.describe "Api::MonthlyPlans", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/monthly_plans" do
    subject { get "/api/monthly_plans", params: }

    let(:params) { { page: 1 } }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "レスポンスの検証" do
        let!(:monthly_plan_1) { create(:monthly_plan, user:) }
        let!(:monthly_plan_2) { create(:monthly_plan, user:) }
        let!(:monthly_plan_3) { create(:monthly_plan, user:) }
        let!(:monthly_plan_by_other_user) { create(:monthly_plan, user: create(:user))  }

        it "ログイン済みユーザーの月次予算計画一覧と200を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq({
                                               "data" => [
                                                 {
                                                   "id" => monthly_plan_3.id,
                                                   "title" => monthly_plan_3.title,
                                                   "description" => monthly_plan_3.description,
                                                   "created_at" => monthly_plan_3.created_at&.iso8601(3),
                                                   "updated_at" => monthly_plan_3.updated_at&.iso8601(3)
                                                 },
                                                 {
                                                   "id" => monthly_plan_2.id,
                                                   "title" => monthly_plan_2.title,
                                                   "description" => monthly_plan_2.description,
                                                   "created_at" => monthly_plan_2.created_at&.iso8601(3),
                                                   "updated_at" => monthly_plan_2.updated_at&.iso8601(3)
                                                 },
                                                 {
                                                   "id" => monthly_plan_1.id,
                                                   "title" => monthly_plan_1.title,
                                                   "description" => monthly_plan_1.description,
                                                   "created_at" => monthly_plan_1.created_at&.iso8601(3),
                                                   "updated_at" => monthly_plan_1.updated_at&.iso8601(3)
                                                 }
                                               ],
                                               "pagination" => {
                                                 "current_page" => 1,
                                                 "per_page" => 20,
                                                 "total_count" => 3,
                                                 "total_pages" => 1
                                               }
                                             })
        end
      end

      context "ページネーションの検証" do
        let!(:monthly_plans) do
          create_list(:monthly_plan, 21, user:)
        end
        let(:params) { { page: 2 } }

        it "2ページ目は残り1件を返す" do
          subject

          body = response.parsed_body

          expect(body["data"].size).to eq(1)
          expect(body["pagination"]).to eq({
                                             "current_page" => 2,
                                             "per_page" => 20,
                                             "total_count" => 21,
                                             "total_pages" => 2
                                           })
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "POST /api/monthly_plans" do
    subject { post "/api/monthly_plans", params: }

    let(:params) do
      {
        monthly_plan: {
          title:,
          description:
        }
      }
    end
    let(:title) { "2026年9月予算" }
    let(:description) { "A社に転職後の予算計画" }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメーターが有効な場合" do
        it "月次予算計画を作成し、201と作成し月次予算計画を返す" do
          expect { subject }.to change(MonthlyPlan, :count).by(1)
          expect(response).to have_http_status(:created)

          target = MonthlyPlan.last
          expect(response.parsed_body).to eq({
                                               "id" =>target&.id,
                                               "title" => title,
                                               "description" => description,
                                               "created_at" => target&.created_at&.iso8601(3),
                                               "updated_at" => target&.updated_at&.iso8601(3)
                                             })
        end

        context "既に同名の月次予算計画が存在する場合" do
          before do
            create(:monthly_plan, title:, user:)
          end

          it "新規で月次予算計画を作成されず、422とエラーメッセージを返す" do
            expect { subject }.to change(MonthlyPlan, :count).by(0)
            expect(response).to have_http_status(:unprocessable_entity)
            expect(response.parsed_body["error"]).to eq({
                                                          "code" => "unprocessable",
                                                          "message" => "入力内容に不備があります。",
                                                          "detail" => {
                                                            "title" => [
                                                              {
                                                                "message" => "計画名はすでに存在します"
                                                              }
                                                            ]
                                                          }
                                                        })
          end
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
