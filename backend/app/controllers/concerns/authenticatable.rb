module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

  # コントローラーで before_action :authorize_request と利用する
  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header

    begin
      decoded = JsonWebToken.decode(header)

      if decoded
        @current_user = User.find(decoded[:user_id])
      else
        render_unauthorized
      end

    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render_unauthorized
    end
  end

  private

  def render_unauthorized
    # TODO：エラーメッセージの内容・形式を検討
    render json: {}, status: :unauthorized
  end
end