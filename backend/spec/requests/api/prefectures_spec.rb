require 'rails_helper'

RSpec.describe "Api::Prefectures", type: :request do
  describe "GET /api/prefectures" do
    subject { get "/api/prefectures" }

    let!(:user) { create(:user) }

    context "ログイン済みの場合" do
      let!(:prefecture1) { create(:prefecture, sequence: 4) }
      let!(:prefecture2) { create(:prefecture, sequence: 1) }
      let!(:prefecture3) { create(:prefecture, sequence: 2) }

      before do
        login_as(user)
      end

      it "200とsequenceの昇順で都道府県マスターを返す" do
        subject
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq([
                                             {
                                               "id" =>
                                                 prefecture2.id,
                                               "name" =>
                                                 prefecture2.name
                                             },
                                             {
                                               "id" =>
                                                 prefecture3.id,
                                               "name" =>
                                                 prefecture3.name
                                             },
                                             {
                                               "id" =>
                                                 prefecture1.id,
                                               "name" =>
                                                 prefecture1.name
                                             }
                                           ])
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
