require "rails_helper"

RSpec.describe IncomePolicy, type: :policy do
  subject { described_class }

  let(:user) { create(:user) }
  let(:life_plan) { create(:life_plan, user:) }

  %i[create? update? destroy?].each do |action|
    permissions action do
      it "自分のライフプランの収入は許可されること" do
        expect(subject).to permit(user, build(:income, life_plan:))
      end

      it "他ユーザーのライフプランの収入は拒否されること" do
        expect(subject).not_to permit(user, build(:income, life_plan: create(:life_plan, user: create(:user))))
      end

      it "未ログインは拒否されること" do
        expect(subject).not_to permit(nil, build(:income, life_plan:))
      end
    end
  end

  describe "Scope" do
    let!(:income) { create(:income, life_plan:) }
    let!(:other_income) { create(:income, life_plan: create(:life_plan, user: create(:user))) }

    it "自分のライフプランの収入のみ返すこと" do
      expect(IncomePolicy::Scope.new(user, Income).resolve).to contain_exactly(income)
    end
  end
end
