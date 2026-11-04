require 'rails_helper'

RSpec.describe "Api::AssetBalances", type: :request do
  let(:user) { create(:user) }

  describe "#create" do
    subject { post "/api/asset_balances", params: }

    let(:params) { {} }
    let!(:asset_account) { create(:asset_account, user: user) }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "有効なパラメーターの場合" do
        let(:params) do
          {
            asset_balance: [
              { asset_account_id: asset_account.id, target_date: Date.current, amount: 10000 },
              { asset_account_id: asset_account.id, target_date: 1.month.ago, amount: 4000 }
            ]
          }
        end

        it "AssetBalanceを新規作成、201を返す" do
          expect { subject }.to change { AssetBalance.count }.by(2)
          expect(response).to have_http_status(:created)
        end
      end

      context "無効なパラメーターの場合" do
        context "他人の資産口座の金額を含む場合" do
          let!(:other_user_asset_account) { create(:asset_account, user: create(:user)) }

          let(:params) do
            {
              asset_balance: [
                { asset_account_id: asset_account.id, target_date: Date.current, amount: 10000 },
                { asset_account_id: other_user_asset_account.id, target_date: 1.month.ago, amount: 4000 }
              ]
            }
          end

          it "AssetBalanceを作成せず、404を返す" do
            expect { subject }.to change { AssetBalance.count }.by(0)
            expect(response).to have_http_status(:not_found)
          end
        end

        context "同じ口座 & 同日のデータを含む場合" do
          let(:params) do
            {
              asset_balance: [
                { asset_account_id: asset_account.id, target_date: 1.month.ago, amount: 10000 },
                { asset_account_id: asset_account.id, target_date: 1.month.ago, amount: 4000 }
              ]
            }
          end

          it "AssetBalanceを作成せず、422を返す" do
            expect { subject }.to change { AssetBalance.count }.by(0)
            expect(response).to have_http_status(:unprocessable_entity)
          end
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
