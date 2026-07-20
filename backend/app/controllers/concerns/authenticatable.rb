module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

  attr_reader :current_user

  # コントローラーで before_action :authorize_request と利用する
  def authorize_request
    token = cookies[:token]
    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id])

  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    render_unauthorized
  end

  private

  def render_unauthorized
    # TODO：エラーメッセージの内容・形式を検討
    render json: {}, status: :unauthorized
  end
end