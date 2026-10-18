require 'rails_helper'

RSpec.describe "Api::MonthlyPlans::MonthlyPlanDetails", type: :request do
  let(:user) { create(:user) }
  let!(:monthly_plan) { create(:monthly_plan, user:) }

  let(:budget_item) { create(:budget_item) }
  let(:budget_item2) { create(:budget_item) }
  let(:budget_item3) { create(:budget_item) }

  describe "#update" do
    subject { put "/api/monthly_plans/#{monthly_plan.id}/monthly_plan_details", params: }

    let(:params) { {} }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメーターが有効な場合" do
        let(:params) do
          {
            monthly_plan_details: [
              { budget_item_id: budget_item.id, amount: 10_000 },
              { budget_item_id: budget_item2.id, amount: 20_000 },
              { budget_item_id: budget_item3.id, amount: 10_000 }
            ]
          }
        end

        context "項目ごとの予算が設定されていない場合" do
          it "MonthlyPlanDetailを新規作成し、200を返す" do
            expect { subject }.to change { monthly_plan.monthly_plan_details.count }.by(3)
            expect(response).to have_http_status(:ok)
          end
        end

        context "項目ごとの予算が設定済みの場合" do
          before do
            create(:monthly_plan_detail, monthly_plan:, budget_item_id: budget_item.id, amount: 0)
            create(:monthly_plan_detail, monthly_plan:, budget_item_id: budget_item2.id, amount: 0)
            create(:monthly_plan_detail, monthly_plan:, budget_item_id: budget_item3.id, amount: 0)
          end

          it "MonthlyPlanDetailを更新し、200を返す" do
            expect { subject }.not_to change { monthly_plan.monthly_plan_details.count }
            expect(response).to have_http_status(:ok)
          end
        end

        context "一部項目が存在しない場合" do
          let(:params) do
            {
              monthly_plan_details: [
                { budget_item_id: budget_item.id, amount: 10_000 },
                { budget_item_id: budget_item3.id, amount: 10_000 }
              ]
            }
          end

          before do
            create(:monthly_plan_detail, monthly_plan:, budget_item_id: budget_item.id, amount: 0)
            create(:monthly_plan_detail, monthly_plan:, budget_item_id: budget_item2.id, amount: 0)
            create(:monthly_plan_detail, monthly_plan:, budget_item_id: budget_item3.id, amount: 0)
          end

          it "MonthlyPlanDetailをそれぞれ更新・削除し、200を返す" do
            expect { subject }.to change { monthly_plan.monthly_plan_details.count }.by(-1)
            expect(response).to have_http_status(:ok)
          end
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
