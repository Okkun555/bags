require "rails_helper"

RSpec.describe "Api::Me", type: :request do
  describe "GET /me" do
    subject { get '/api/me', headers: headers }

    let!(:user) { create(:user) }

    context "認証済みの場合" do
      before do
        login_as(user)
      end

      context "プロフィール未作成の場合" do
        it "200とログイン中のユーザー情報を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body). to eq({
                                                "id" => user.id,
                                                "email" => user.email,
                                                "profile" => nil
                                              })
        end
      end

      context "プロフィール作成済みの場合" do
        let!(:occupation) { create(:occupation) }
        let!(:prefecture) { create(:prefecture) }
        let!(:profile) { create(:profile, user: user, occupation: occupation, prefecture: prefecture) }

        it "200とログイン中のユーザー情報を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body). to eq({
                                                "id" => user.id,
                                                "email" => user.email,
                                                "profile" => {
                                                  "id" => profile.id,
                                                  "name" => profile.name,
                                                  "date_of_birth" => profile.date_of_birth.to_s ,
                                                  "gender" => profile.gender,
                                                  "marital_status" => profile.marital_status,
                                                  "income" => profile.income,
                                                  "occupation" => {
                                                    "id" => occupation.id,
                                                    "name" => occupation.name
                                                  },
                                                  "prefecture" => {
                                                    "id" => prefecture.id,
                                                    "name" => prefecture.name
                                                  }
                                                }
                                              })
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
