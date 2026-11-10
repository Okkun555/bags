require 'rails_helper'

RSpec.describe FamilyMember, type: :model do
  describe "バリデーション" do
    it "有効なデータは保存できる" do
      expect(build(:family_member)).to be_valid
    end

    it "nameが空の場合は無効" do
      expect(build(:family_member, name: "")).not_to be_valid
    end

    it "birthdayが空の場合は無効" do
      expect(build(:family_member, birthday: nil)).not_to be_valid
    end

    it "不正なrelationshipは無効" do
      expect(build(:family_member, relationship: "friend")).not_to be_valid
    end

    it "不正なrelationshipはDBレベルで弾かれる" do
      member = create(:family_member)
      expect { member.update_column(:relationship, "friend") }.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "定義済みのrelationshipはすべて保存できる" do
      described_class.relationships.each_key do |relationship|
        expect(build(:family_member, relationship:)).to be_valid
      end
    end
  end

  describe "削除時の挙動" do
    it "収入が紐づいている場合は削除できない" do
      income = create(:income)
      expect(income.family_member.destroy).to be false
      expect(FamilyMember.exists?(income.family_member_id)).to be true
    end

    it "紐づくデータが無ければ削除できる" do
      member = create(:family_member)
      expect { member.destroy! }.to change(described_class, :count).by(-1)
    end
  end
end
