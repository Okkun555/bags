class Api::AuthController < ApplicationController
  skip_before_action :authorize_request, only: [:signup, :login]

  def signup
    user = User.new(user_params)

    if user.save
      token = JsonWebToken.encode(user_id: user.id)

      cookies[:token] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: Rails.env.production? ? :none : :lax,
        expires: 24.hours.from_now,
        path: "/",
      }

      render json: UserSerializer.render_as_json(user), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    email = params[:email]
    password = params[:password]

    user = User.find_by(email:)

    if user && user.authenticate(password)
      token = JsonWebToken.encode(user_id: user.id)

      cookies[:token] = {
        value: token,
        httponly: true,
        expires: 24.hours.from_now,
        path: "/",
      }
      
      render json: UserSerializer.render_as_json(user), status: :ok
    else
      render json: { error: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
    end
  end

  def logout
    cookies.delete(:token, path: "/")
    render json: { message: 'ログアウトしました' }, status: :ok
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation)
  end
end
