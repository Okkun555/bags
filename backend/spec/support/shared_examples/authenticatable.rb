RSpec.shared_examples 'requires authentication' do
  context 'Authorizationヘッダーが無い場合' do
    it '401を返す' do
      subject
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context '不正なトークンの場合' do
    before do
      login_as(user, token: "invalid token")
    end

    it '401を返す' do
      subject
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context 'トークンの有効期限が切れている場合' do
    let(:token) { JsonWebToken.encode({ user_id: user.id }, 1.hour.ago) }
    before do
      login_as(user, token)
    end

    it '401を返す' do
      subject
      expect(response).to have_http_status(:unauthorized)
    end
  end
end