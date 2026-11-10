require "rails_helper"

RSpec.describe InvestmentPolicy, type: :policy do
  subject { described_class }

  let(:user) { create(:user) }
  let(:life_plan) { create(:life_plan, user:) }

  %i[create? update? destroy?].each do |action|
    permissions action do
      it "自分のライフプランの投資は許可されること" do
        expect(subject).to permit(user, build(:investment, life_plan:))
      end

      it "他ユーザーのライフプランの投資は拒否されること" do
        expect(subject).not_to permit(user, build(:investment, life_plan: create(:life_plan, user: create(:user))))
      end

      it "未ログインは拒否されること" do
        expect(subject).not_to permit(nil, build(:investment, life_plan:))
      end
    end
  end

  describe "Scope" do
    let!(:investment) { create(:investment, life_plan:) }
    let!(:other_investment) { create(:investment, life_plan: create(:life_plan, user: create(:user))) }

    it "自分のライフプランの投資のみ返すこと" do
      expect(InvestmentPolicy::Scope.new(user, Investment).resolve).to contain_exactly(investment)
    end
  end
end
