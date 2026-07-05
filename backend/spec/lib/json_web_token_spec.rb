require "rails_helper"

RSpec.describe JsonWebToken, type: :library do
  let(:payload) { { user_id: 1 } }

  describe '.encode と .decode' do
    it '正しいペイロードからトークンを生成し、それを復号できること' do
      token = JsonWebToken.encode(payload)
      expect(token).to be_a(String)

      decoded = JsonWebToken.decode(token)
      expect(decoded[:user_id]).to eq(1)
    end

    it '不正なトークンや期限切れのトークンの場合は nil を返すこと' do
      invalid_token = "invalid.token.string"
      expect(JsonWebToken.decode(invalid_token)).to be_nil
    end
  end
end