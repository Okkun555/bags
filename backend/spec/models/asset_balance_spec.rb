require 'rails_helper'

RSpec.describe AssetBalance, type: :model do
  describe ".bulk_create!" do
    subject { described_class.bulk_create!(user, attrs_list) }

    let(:user) { create(:user) }
    let(:other_user) { create(:user)}

    let(:asset_account) { create(:asset_account, user:) }
    let(:asset_account2) { create(:asset_account, user:) }
    let(:others_asset_account) { create(:asset_account, user: other_user) }

    context "正常な複数口座分のデータが送られた場合" do
      let(:attrs_list) do
        [
          { asset_account_id: asset_account.id, target_date: Date.new(2026, 10, 31), amount: 1000 },
          { asset_account_id: asset_account2.id, target_date: Date.new(2026, 10, 31), amount: 2000 },
        ]
      end

      it "全件が作成される" do
        expect { subject }.to change(AssetBalance, :count).by(2)
        balance = AssetBalance.find_by(asset_account_id: asset_account.id)
        balance2 = AssetBalance.find_by(asset_account_id: asset_account2.id)
        expect(balance&.amount).to eq(1000)
        expect(balance&.target_date).to eq(Date.new(2026, 10, 31))
        expect(balance2&.amount).to eq(2000)
        expect(balance2&.target_date).to eq(Date.new(2026, 10, 31))
      end
    end

    context "異常系" do
      context "他人の口座を対象としたデータを含む場合" do
        let(:attrs_list) do
          [
            { asset_account_id: asset_account.id, target_date: Date.new(2026, 10, 31), amount: 1000 },
            { asset_account_id: others_asset_account.id, target_date: Date.new(2026, 10, 31), amount: 2000 },
          ]
        end

        it "RecordNotFoundが発生し、データは作成されない" do
          expect { subject }.to raise_error(ActiveRecord::RecordNotFound).and change(AssetBalance, :count).by(0)
        end
      end

      context "同日 && 同口座のデータを含む場合" do
        let(:attrs_list) do
          [
            { asset_account_id: asset_account.id, target_date: Date.new(2026, 10, 31), amount: 1000 },
            { asset_account_id: asset_account.id, target_date: Date.new(2026, 10, 31), amount: 2000 },
          ]
        end

        it "ActiveRecord::RecordInvalidが発生し、データは作成されない" do
          expect { subject }.to raise_error(ActiveRecord::RecordInvalid).and change(AssetBalance, :count).by(0)
        end
      end
    end
  end
end
