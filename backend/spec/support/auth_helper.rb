module AuthHelper
  def login_as(user, token = nil)
    token = token ? token :  JsonWebToken.encode(user_id: user.id)
    cookies[:token] = token
  end
end