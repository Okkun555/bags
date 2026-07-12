RSpec.shared_examples 'requires authentication' do
  context 'Authorizationヘッダーが無い場合' do
    let(:headers) { {} }

    it '401を返す' do
      subject
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context '不正なトークンの場合' do
    let(:headers) { { 'Authorization' => 'Bearer invalid_token' } }

    it '401を返す' do
      subject
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context 'トークンの有効期限が切れている場合' do
    let(:headers) do
      token = JsonWebToken.encode({ user_id: user.id }, 1.hour.ago)
      { 'Authorization' => "Bearer #{token}" }
    end

    it '401を返す' do
      subject
      expect(response).to have_http_status(:unauthorized)
    end
  end
end