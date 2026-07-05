require 'rails_helper'

RSpec.describe "Api::Auth", type: :request do
  describe "POST /signup" do
    subject { post "/api/signup", params: }

    let(:params) do
      {
        user: {
          email: 'new@example.com',
          password: 'password',
          password_confirmation: 'password'
        }
      }
    end

    context "有効なパラメーターの場合" do
      it "新しいユーザーを作成し、201ステータスコードとトークン、ユーザー情報を返す" do
        expect { subject }.to change(User, :count).by(1)
        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json["token"]).to be_present
      end
    end

    context "無効なパラメーターの場合" do
      context "パスワードが一致しない場合" do
        let(:params) do
          {
            user: {
              email: 'new@example.com',
              password: 'password',
              password_confirmation: 'password111'
            }
          }
        end

        it "422ステータスコードとエラーメッセージを返す" do
          expect{ subject }.not_to change(User, :count)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe "POST /login" do
    subject { post "/api/login", params:  }

    let(:email) { "sample@email.com" }
    let(:password) { "password" }
    let(:params) { { user: { email:, password: } } }

    before do
      create(:user, email:, password: password)
    end

    context "有効なパラメーターの場合" do
      it "200ステータスコードと生成したトークンを返す" do
        subject
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["token"]).to be_present
      end
    end

    context "無効なパラメーターの場合" do
      context "メールアドレスが異なる場合" do
        let(:params) { { user: { email: "other_email@sample.com", password: password } } }

        it "401ステータスコードとエラーメッセージを返す" do
          subject
          expect(response).to have_http_status(:unauthorized)
          expect(response.parsed_body["token"]).to be_nil
        end
      end

      context "パスワードが異なる場合" do
        let(:params) { { user: { email: email, password: "wrong_password" } } }

        it "401ステータスコードとエラーメッセージを返す" do
          subject
          expect(response).to have_http_status(:unauthorized)
          expect(response.parsed_body["token"]).to be_nil
        end
      end

      context "メールアドレス、パスワードどちらも異なる場合" do
        let(:params) { { user: { email: "other_email@sample.com", password: "wrong_password" } } }

        it "401ステータスコードとエラーメッセージを返す" do
          subject
          expect(response).to have_http_status(:unauthorized)
          expect(response.parsed_body["token"]).to be_nil
        end
      end
    end
  end
end
