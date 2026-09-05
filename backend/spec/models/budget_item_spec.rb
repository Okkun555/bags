require 'rails_helper'

RSpec.describe BudgetItem, type: :model do
  describe "#custom?" do
    context "デフォルト予算項目の場合" do
      let(:default_item) { create(:budget_item, user: nil) }

      it "falseを返す" do
        expect(default_item.custom?).to be false
      end
    end

    context "カスタム予算項目の場合" do
      let(:custom_item) { create(:budget_item, user: create(:user)) }

      it "trueを返す" do
        expect(custom_item.custom?).to be true
      end
    end
  end

  describe "システムがデフォルトで用意する予算項目の保護" do
    context "デフォルト項目の場合" do
      let!(:default_item) { create(:budget_item, user: nil) }

      it "更新できず、エラーメッセージが追加される" do
        expect(default_item.update(name: "更新")).to be_falsey
        expect(default_item.errors[:base]).to include("デフォルト項目は編集できません")
      end

      it "削除できず、エラーメッセージが追加される" do
        expect { default_item.destroy }.not_to change(BudgetItem, :count)
        expect(default_item.errors[:base]).to include("デフォルト項目は削除できません")
      end
    end

    context "カスタム項目の場合" do
      let!(:custom_item) { create(:budget_item, user: create(:user)) }

      it "更新できる" do
        expect(custom_item.update(name: "更新")).to be true
        expect(custom_item.name).to eq("更新")
      end

      it "削除できる" do
        expect { custom_item.destroy }.to change(BudgetItem, :count).to(0)
      end
    end
  end
end
