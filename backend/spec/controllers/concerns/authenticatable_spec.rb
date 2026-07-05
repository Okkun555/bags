require "rails_helper"

RSpec.describe Authenticatable, type: :controller do
  # テスト用のMock Controller
  controller(ApplicationController) do
    def index
      render json: { message: 'success' }, status: :ok
    end
  end

  let!(:user) { create(:user, email: 'existing@example.com') }

  describe '#authorize_request' do
    context '有効なトークンがヘッダーにある場合' do
      it 'リクエストが成功すること' do
        token = JsonWebToken.encode(user_id: user.id)
        request.headers['Authorization'] = "Bearer #{token}"

        get :index
        expect(response).to have_http_status(:ok)
      end
    end

    context 'トークンがない、または不正な場合' do
      it '401 Unauthorized エラーを返すこと' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end