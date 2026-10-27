require 'rails_helper'

RSpec.describe "Api::AssetAccounts", type: :request do
  let(:user) { create(:user) }

  describe "#create" do
    subject { post "/api/asset_accounts", params: }

    let(:params) do
      {
        asset_account: {
          name:,
          code:,
          account_type:,
          memo:,
        }
      }
    end

    let(:name) { "UFJ銀行" }
    let(:code) { "ufj_1" }
    let(:account_type) { "cash" }
    let(:memo) { "生活費用の口座" }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメーターが有効な場合" do
        it "口座マスターを作成し、201を返す" do
          expect { subject }.to change(AssetAccount, :count).by(1)
          expect(response).to have_http_status(:created)
          expect(response.parsed_body).to eq({
                                               "id" => AssetAccount.last&.id,
                                               "name" => name,
                                               "code" => code,
                                               "account_type" => account_type,
                                               "memo" => memo,
                                             })
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
