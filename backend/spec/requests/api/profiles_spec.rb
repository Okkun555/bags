require 'rails_helper'

RSpec.describe "Api::Profiles", type: :request do
  describe "POST /api/profiles" do
    subject { post "/api/profiles", params: }

    let(:user) { create(:user) }

    let(:name) { "アカウント名" }
    let(:date_of_birth) { 20.years.ago.strftime("%Y-%m-%d") }
    let(:gender) { "female" }
    let(:marital_status) { "married" }
    let(:income) { "from_400_to_600" }
    let(:params) do
      {
        profile: {
          name:,
          date_of_birth:,
          gender:,
          marital_status:,
          income:,
        }
      }
    end

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "有効なパラメータの場合" do
        context "プロフィールが未作成の場合" do
          it "ユーザーに紐づくProfileを作成し、201(created)を返す" do
            expect { subject }.to change(Profile, :count).by(+1)
            expect(response).to have_http_status(:created)

            profile = Profile.last
            expect(response.parsed_body).to eq({
                                                 "id" => profile&.id,
                                                 "name" => params[:profile][:name],
                                                 "date_of_birth" => params[:profile][:date_of_birth],
                                                 "gender" => params[:profile][:gender],
                                                 "marital_status" => params[:profile][:marital_status],
                                                 "income" => params[:profile][:income],
                                               })
          end
        end

        context "プロフィールが作成済みの場合" do
          before do
            create(:profile, user: user)
          end

          it "Profileを作成せず、409(conflict)を返す" do
            expect { subject }.not_to change(Profile, :count)
            expect(response).to have_http_status(:conflict)
            expect(response.parsed_body["error"]["message"]).to eq("アカウントに紐づくプロフィールが既に存在します。")
          end
        end
      end

      context "無効なパラメータの場合" do
        let(:name) { '' }
        let(:gender) { 'unknown' }

        it "エラーメッセージと422(unprocessable_entity)を返す" do
          expect { subject }.not_to change(Profile, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          error = response.parsed_body["error"]
          expect(error["message"]).to eq("入力内容に不備があります。")
          expect(error["detail"]).to eq({
                                          "gender" => [{
                                                         "message" => "性別は一覧にありません"
                                                       }],
                                          "name" => [{
                                                       "message" => "アカウント名を入力してください"
                                                     }]
                                        })
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
