require 'rails_helper'

RSpec.describe Income, type: :model do
  describe "バリデーション" do
    it "有効なデータは保存できる" do
      expect(build(:income)).to be_valid
    end

    it "end_to が NULL でも保存できる" do
      expect(create(:income, end_to: nil).end_to).to be_nil
    end

    it "start_from と end_to が同じ年でも保存できる" do
      expect(build(:income, start_from: 2030, end_to: 2030)).to be_valid
    end

    it "amountが0の場合は無効" do
      expect(build(:income, amount: 0)).not_to be_valid
    end

    it "amountが負の場合は無効" do
      expect(build(:income, amount: -1)).not_to be_valid
    end

    it "start_from > end_to の場合は無効" do
      expect(build(:income, start_from: 2031, end_to: 2030)).not_to be_valid
    end

    it "不正な種別は無効" do
      expect(build(:income, income_type: "invalid")).not_to be_valid
    end

    it "amountがinteger上限を超える場合は無効" do
      expect(build(:income, amount: 2_147_483_648)).not_to be_valid
    end

    it "別のライフプランの family_member は無効" do
      other_member = create(:family_member)
      record = build(:income, family_member: other_member)
      expect(record).not_to be_valid
      expect(record.errors[:family_member]).to be_present
    end
  end

  describe ".to_annual_amount" do
    it "月額の場合は12倍した年額を返す" do
      expect(described_class.to_annual_amount("250000", "monthly")).to eq(3_000_000)
    end

    it "年額の場合はそのまま返す" do
      expect(described_class.to_annual_amount("3000000", "annual")).to eq("3000000")
    end

    it "月額で数値として解釈できない場合はそのまま返す" do
      expect(described_class.to_annual_amount("abc", "monthly")).to eq("abc")
    end
  end

  describe "DB制約" do
    let(:record) { create(:income) }

    it "amount <= 0 は弾かれる" do
      expect { record.update_column(:amount, 0) }.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "start_from > end_to は弾かれる" do
      expect { record.update_columns(start_from: 2031, end_to: 2030) }.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "不正な種別は弾かれる" do
      expect { record.update_column(:income_type, "invalid") }.to raise_error(ActiveRecord::StatementInvalid)
    end
  end
end
