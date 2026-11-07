require "rails_helper"

RSpec.describe LifePlanPolicy, type: :policy do
  subject { described_class }

  let(:user) { User.new }
  let(:life_plan) { LifePlan.new }

  permissions :index? do
    context "ログイン済みの場合" do
      it "許可されること" do
        expect(subject).to permit(user, life_plan)
      end
    end

    context "未ログインの場合" do
      let(:user) { nil }

      it "拒否されること" do
        expect(subject).not_to permit(user, life_plan)
      end
    end
  end

  permissions :create? do
    context "ログイン済みの場合" do
      it "許可されること" do
        expect(subject).to permit(user, life_plan)
      end
    end

    context "未ログインの場合" do
      let(:user) { nil }

      it "拒否されること" do
        expect(subject).not_to permit(user, life_plan)
      end
    end
  end

  %i[show? update? destroy?].each do |action|
    permissions action do
      let(:user) { create(:user) }

      it "自分のライフプランは許可されること" do
        expect(subject).to permit(user, build(:life_plan, user:))
      end

      it "他ユーザーのライフプランは拒否されること" do
        expect(subject).not_to permit(user, build(:life_plan, user: create(:user)))
      end

      it "未ログインは拒否されること" do
        expect(subject).not_to permit(nil, build(:life_plan, user:))
      end
    end
  end

  describe "Scope" do
    let(:user) { create(:user) }
    let!(:life_plan) { create(:life_plan, user:) }
    let!(:other_life_plan) { create(:life_plan, user: create(:user)) }

    it "自分のライフプランのみ返すこと" do
      expect(LifePlanPolicy::Scope.new(user, LifePlan).resolve).to contain_exactly(life_plan)
    end
  end
end
