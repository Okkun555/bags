require 'rails_helper'

RSpec.describe "Api::MonthlyPlans", type: :request do
  let(:user) { create(:user) }

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
                                                                "message" => "計画名はすでに存在します",
                                                              },
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
