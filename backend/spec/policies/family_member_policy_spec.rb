require "rails_helper"

RSpec.describe FamilyMemberPolicy, type: :policy do
  subject { described_class }

  let(:user) { create(:user) }
  let(:life_plan) { create(:life_plan, user:) }

  %i[create? update? destroy?].each do |action|
    permissions action do
      it "自分のライフプランのメンバーは許可されること" do
        expect(subject).to permit(user, build(:family_member, life_plan:))
      end

      it "他ユーザーのライフプランのメンバーは拒否されること" do
        expect(subject).not_to permit(user, build(:family_member, life_plan: create(:life_plan, user: create(:user))))
      end

      it "未ログインは拒否されること" do
        expect(subject).not_to permit(nil, build(:family_member, life_plan:))
      end
    end
  end

  describe "Scope" do
    let!(:member) { create(:family_member, life_plan:) }
    let!(:other_member) { create(:family_member, life_plan: create(:life_plan, user: create(:user))) }

    it "自分のライフプランのメンバーのみ返すこと" do
      expect(FamilyMemberPolicy::Scope.new(user, FamilyMember).resolve).to contain_exactly(member)
    end
  end
end
