require "rails_helper"

RSpec.describe "Api::Me", type: :request do
  describe "GET /me" do
    subject { get '/api/me', headers: headers }

    let!(:user) { create(:user) }
    let(:headers) { auth_headers(user) }

    it_behaves_like 'requires authentication'

    context "認証済みの場合" do
      it "200とログイン中のユーザー情報を返す" do
        subject
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body). to eq({
                                              "id" => user.id,
                                              "email" => user.email
                                            })
      end
    end
  end
end
