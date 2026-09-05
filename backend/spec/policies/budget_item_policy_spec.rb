require "rails_helper"

RSpec.describe BudgetItemPolicy do
  let(:owner) { create(:user) }
  let(:other_user) { create(:user) }
  let(:custom_item) { create(:budget_item, user: owner) }
  let(:default_item) { create(:budget_item, user: nil) }

  describe "#destroy?" do
    it "カスタム予算項目の作成者本人は削除できる" do
      expect(described_class.new(owner, custom_item).destroy?).to be true
    end

    it "他人のカスタム予算項目は削除できない" do
      expect(described_class.new(other_user, custom_item).destroy?).to be false
    end

    it "デフォルト項目は削除できない" do
      expect(described_class.new(owner, default_item).destroy?).to be false
    end
  end
end
