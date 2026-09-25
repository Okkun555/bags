require 'rails_helper'

RSpec.describe "Api::MonthlyPlans::HouseholdBudgets", type: :request do
  let(:user) { create(:user) }
  let!(:monthly_plan) { create(:monthly_plan, user: ) }

  describe "#update" do
    subject { put "/api/monthly_plans/#{monthly_plan.id}/household_budgets", params: }

    let(:params) { {} }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメーターが有効な場合" do
        context "新規で登録する場合" do
          let(:params) do
            {
              household_budgets: [
                { id: nil, relationship: "me", income: 200_000 },
                { id: nil, relationship: "spouse", income: 100_000 },
              ]
            }
          end

          it "HouseholdBudgetを新規作成し、200を返す" do
            expect { subject }.to change { monthly_plan.household_budgets.count }.by(2)
            expect(response).to have_http_status(:ok)
          end
        end

        context "更新する場合" do
          let!(:household_budget_1) { create(:household_budget, :spouse, monthly_plan: monthly_plan, income: 100_000) }
          let!(:household_budget_2) { create(:household_budget, :father, monthly_plan: monthly_plan, income: 100_000) }
          let(:params) do
            {
              household_budgets: [
                { id: household_budget_1.id, relationship: "spouse", income: 200_000 },
                { id: household_budget_2.id, relationship: "father", income: 100_000 },
              ]
            }
          end

          it "変更があるHouseholdBudgetを更新し、200を返す" do
            expect { subject }.not_to change { monthly_plan.household_budgets.count }
            expect(response).to have_http_status(:ok)

            target1 = HouseholdBudget.find_by(id: household_budget_1.id)
            target2 = HouseholdBudget.find_by(id: household_budget_2.id)

            expect(target1["income"]).to eq(200_000)
            expect(target1["relationship"]).to eq("spouse")
            expect(target1["updated_at"]).not_to eq(household_budget_1.updated_at)
            expect(target2["income"]).to eq(100_000)
            expect(target2["relationship"]).to eq("father")
            # 変更がない場合、更新日はそのままであること
            expect(target2["updated_at"]).to eq(household_budget_2.updated_at)
          end
        end

        context "削除する場合" do
          let!(:household_budget_1) { create(:household_budget, :spouse, monthly_plan: monthly_plan, income: 100_000) }
          let!(:household_budget_2) { create(:household_budget, :father, monthly_plan: monthly_plan, income: 100_000) }
          let(:params) do
            {
              household_budgets: [
                { id: household_budget_2.id, relationship: "father", income: 100_000 },
              ]
            }
          end

          it "対象のHouseholdBudgetを削除し、200を返す" do
            expect { subject }.to change { monthly_plan.household_budgets.count }.by(-1)
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
