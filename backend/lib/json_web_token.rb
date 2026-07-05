class JsonWebToken
  SECRET_KEY = Rails.application.credentials.secret_key_base

  # ユーザーIDを元にトークンを発行（有効期限は24時間）
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  # トークンを検証して中身（ペイロード）を取り出す
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  rescue JWT::DecodeError
    nil
  end
end