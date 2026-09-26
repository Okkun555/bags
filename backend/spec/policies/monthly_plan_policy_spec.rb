require "rails_helper"

RSpec.describe MonthlyPlanPolicy, type: :policy do
  subject { described_class }

  let(:user) { User.new }
  let(:monthly_plan) { MonthlyPlan.new }

  permissions :index?, :create? do
    context "ログイン済みの場合" do
      it "許可されること" do
        expect(subject).to permit(user, monthly_plan)
      end
    end

    context "未ログインの場合" do
      let(:user) { nil }

      it "拒否されること" do
        expect(subject).not_to permit(user, monthly_plan)
      end
    end
  end

  permissions :show? do
    context "自身の予算計画の場合" do
      it "許可されること" do
        monthly_plan = MonthlyPlan.new(user: user)
        expect(subject).to permit(user, monthly_plan)
      end
    end

    context "他人の予算計画の場合" do
      it "拒否されること" do
        monthly_plan = MonthlyPlan.new(user: create(:user))
        expect(subject).not_to permit(user, monthly_plan)
      end
    end
  end
end
