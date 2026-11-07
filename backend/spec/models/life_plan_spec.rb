require 'rails_helper'

RSpec.describe LifePlan, type: :model do
  describe "バリデーション" do
    let(:user) { create(:user) }

    it "有効なデータは保存できる" do
      expect(build(:life_plan, user:)).to be_valid
    end

    it "end_to が NULL でも保存できる" do
      expect(build(:life_plan, user:, end_to: nil)).to be_valid
    end

    it "nameが空の場合は無効" do
      expect(build(:life_plan, user:, name: "")).not_to be_valid
    end

    it "end_to が start_from より前の場合は無効" do
      expect(build(:life_plan, user:, start_from: 2030, end_to: 2029)).not_to be_valid
    end

    context "同じユーザーで同名のライフプランがある場合" do
      before { create(:life_plan, user:, name: "老後") }

      it "バリデーションで弾かれる" do
        expect(build(:life_plan, user:, name: "老後")).not_to be_valid
      end

      it "DBレベルでも弾かれる" do
        plan = build(:life_plan, user:, name: "老後")
        expect { plan.save!(validate: false) }.to raise_error(ActiveRecord::RecordNotUnique)
      end

      it "別ユーザーなら同名で作成できる" do
        expect(build(:life_plan, name: "老後")).to be_valid
      end
    end
  end

  describe "削除時の挙動" do
    it "家族メンバー・収入・投資も一緒に削除される" do
      income = create(:income)
      create(:investment, life_plan: income.life_plan, family_member: income.family_member)

      expect { income.life_plan.destroy! }
        .to change(FamilyMember, :count).by(-1)
        .and change(Income, :count).by(-1)
        .and change(Investment, :count).by(-1)
    end
  end
end
