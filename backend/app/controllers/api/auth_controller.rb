class Api::AuthController < ApplicationController
  skip_before_action :authorize_request, only: [:signup, :login]

  def signup
    user = User.new(user_params)

    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: {
        token:,
        user: UserSerializer.render_as_hash(user)
      }, status: :created
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
      render json: {
        token:,
        user: UserSerializer.render_as_hash(user)
      }, status: :ok
    else
      render json: { error: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
    end
  end

  def logout
    # ステートレスな認証の為、サーバー側の処理は不要
    # フロント（React）側でトークンを破棄すればログアウトが完了するが、サーバー側でも処理を受けた事を確認するためレスポンスを返す
    render json: { message: 'ログアウトしました' }, status: :ok
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation)
  end
end
