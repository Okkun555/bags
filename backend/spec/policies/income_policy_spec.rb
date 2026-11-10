require "rails_helper"

RSpec.describe IncomePolicy, type: :policy do
  subject { described_class }

  let(:user) { create(:user) }
  let(:life_plan) { create(:life_plan, user:) }

  permissions :destroy? do
    it "自分のライフプランのものは許可されること" do
      expect(subject).to permit(user, build(:income, life_plan:))
    end

    it "他ユーザーのライフプランのものは拒否されること" do
      expect(subject).not_to permit(user, build(:income, life_plan: create(:life_plan, user: create(:user))))
    end

    it "未ログインは拒否されること" do
      expect(subject).not_to permit(nil, build(:income, life_plan:))
    end
  end

  describe "Scope" do
    let!(:record) { create(:income, life_plan:) }
    let!(:other_record) { create(:income, life_plan: create(:life_plan, user: create(:user))) }

    it "自分のライフプランのものだけ返すこと" do
      expect(IncomePolicy::Scope.new(user, Income).resolve).to contain_exactly(record)
    end
  end
end
