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

  describe "#update_monthly_plan_details!" do
    subject { monthly_plan.update_monthly_plan_details!(attrs_list) }

    let(:monthly_plan) { create(:monthly_plan) }
    let(:attrs_list) { [] }

    let(:budget_item) { create(:budget_item) }
    let(:budget_item2) { create(:budget_item) }
    let(:budget_item3) { create(:budget_item) }

    context "レコードが存在しない場合" do
      let(:attrs_list) do
        [
          { budget_item_id: budget_item.id, amount: 10_000 },
          { budget_item_id: budget_item2.id, amount: 20_000 },
          { budget_item_id: budget_item3.id, amount: 0 },
        ]
      end

      it "新規レコードを作成する" do
        expect { subject }.to change { monthly_plan.monthly_plan_details.count }.by(3)
      end
    end

    context "既存レコードがある場合" do
      let(:attrs_list) do
        [
          { budget_item_id: budget_item.id, amount: 0 },
          { budget_item_id: budget_item2.id, amount: 0 },
          { budget_item_id: budget_item3.id, amount: 10_000 },
        ]
      end

      before do
        create(:monthly_plan_detail, monthly_plan:, budget_item:, amount: 10_000)
        create(:monthly_plan_detail, monthly_plan:, budget_item: budget_item2, amount: 20_000)
        create(:monthly_plan_detail, monthly_plan:, budget_item: budget_item3, amount: 0)
      end

      it "既存レコードを更新する" do
        expect { subject }.not_to change { monthly_plan.monthly_plan_details.count }

        target1 = MonthlyPlanDetail.find_by(monthly_plan_id: monthly_plan.id, budget_item_id: budget_item.id)
        target2 = MonthlyPlanDetail.find_by(monthly_plan_id: monthly_plan.id, budget_item_id: budget_item2.id)
        target3 = MonthlyPlanDetail.find_by(monthly_plan_id: monthly_plan.id, budget_item_id: budget_item3.id)

        expect(target1&.amount).to eq(0)
        expect(target2&.amount).to eq(0)
        expect(target3&.amount).to eq(10_000)
      end
    end

    context "重複したbudget_item_idが送信された場合" do
      let(:attrs_list) do
        [
          { budget_item_id: budget_item.id, amount: 10_000 },
          { budget_item_id: budget_item.id, amount: 20_000 },
        ]
      end

      it "エラーになる" do
        expect { subject }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end
