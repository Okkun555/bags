require 'rails_helper'

RSpec.describe MonthlyPlan, type: :model do
  describe "#update_household_budgets!" do
    subject { monthly_plan.update_household_budgets!(attrs_list)}

    let(:monthly_plan) { create(:monthly_plan) }
    let(:attrs_list) { [] }

    context "新規レコードを含む場合" do
      let(:attrs_list) do
        [
          { id: nil, relationship: "me", income: 300_000 },
          { id: nil, relationship: "spouse", income: 200_000 },
        ]
      end

      it "household_budgetsが作成される" do
        expect {
          monthly_plan.update_household_budgets!(attrs_list)
        }.to change { monthly_plan.household_budgets.count }.by(2)
      end
    end

    context "既存レコードのIDを含む場合" do
      let(:household_budget1) { create(:household_budget, monthly_plan:, income: 100_000) }

      let(:attrs_list) do
        [ { id: household_budget1.id, relationship: "me", income: 300_000 } ]
      end

      it "既存レコードが更新される" do
        subject
        expect(household_budget1.reload.income).to eq(300_000)
      end
    end

    context "既存レコードが送られてこない場合" do
      let!(:household_budget1) { create(:household_budget, monthly_plan:, income: 100_000) }
      let(:attrs_list) { [] }

      it "レコードが削除される" do
        expect { subject }.to change { monthly_plan.household_budgets.count }.by(-1)
      end
    end
  end
end
