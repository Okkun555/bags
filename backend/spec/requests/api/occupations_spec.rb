require 'rails_helper'

RSpec.describe "Api::Occupations", type: :request do
  describe "GET /occupations" do
    subject { get '/api/occupations' }

    let!(:user) { create(:user) }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "職種マスターが登録済みの場合" do
        let!(:occupation1) { create(:occupation, sequence: 4) }
        let!(:occupation2) { create(:occupation, sequence: 1) }
        let!(:occupation3) { create(:occupation, sequence: 2) }

        it "200とsequenceの昇順で職種マスターを返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([
                                               {
                                                 "id" => occupation2.id,
                                                 "name" => occupation2.name
                                               },
                                               {
                                                 "id" => occupation3.id,
                                                 "name" => occupation3.name
                                               },
                                               {
                                                 "id" => occupation1.id,
                                                 "name" => occupation1.name
                                               }
                                             ])
        end
      end

      context "職種マスターが未登録の場合" do
        it "200と空配列を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([])
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
