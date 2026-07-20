require "rails_helper"

RSpec.describe JsonWebToken, type: :library do
  let(:payload) { { user_id: 1 } }

  describe '.encode' do
    it '正しいペイロードからトークンを生成し、それを復号できること' do
      token = JsonWebToken.encode(payload)
      expect(token).to be_a(String)

      decoded = JsonWebToken.decode(token)
      expect(decoded[:user_id]).to eq(1)
    end
  end

  describe '.decode' do
    context '不正なトークンが渡された場合' do
      it 'JWT::DecodeError が発生すること' do
        # nil を期待するのではなく、例外が投げられることを検証する
        expect {
          JsonWebToken.decode('invalid_token')
        }.to raise_error(JWT::DecodeError)
      end
    end

    context '期限切れのトークンが渡された場合' do
      it 'JWT::ExpiredSignature が発生すること' do
        expired_token = JsonWebToken.encode({ user_id: 1 }, 1.hour.ago)

        expect {
          JsonWebToken.decode(expired_token)
        }.to raise_error(JWT::ExpiredSignature)
      end
    end
  end
end