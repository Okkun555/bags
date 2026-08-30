class ApplicationController < ActionController::API
  include Authenticatable
  include ActionController::Cookies
  include Pundit::Authorization

  before_action :authorize_request

  rescue_from StandardError, with: :render_internal_server_error
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden_error

  # 400 Bad Request
  def render_bad_request(message)
    render_error(code: "bad_request", message: message, status: :bad_request)
  end

  # 403 Forbidden Error
  def render_forbidden_error
    render_error(code: "forbidden", message: "この操作を行う権限がありません。", status: :forbidden)
  end

  # 404 Not Found
  def render_not_found(exception = nil)
    render_error(
      code: "not_found",
      message: exception&.message || "対象のリソースが見つかりません。",
      status: :not_found,
      )
  end

  # 409 Conflict Error
  def render_conflict(message)
    render_error(code: "conflict", message:, status: :conflict)
  end

  # 422 Unprocessable Entity Error
  def render_unprocessable_entity(exception)
    render_error(
      code: "unprocessable",
      message: "入力内容に不備があります。",
      status: :unprocessable_entity,
      details: exception.record.errors.group_by(&:attribute).transform_values do |errors|
        errors.map do |error|
          {
            message: error.full_message
          }
        end
      end
    )
  end

  # 500 Internal Server Error
  def render_internal_server_error(exception)
    # ログを残して、フロントエンドには共通IFでレスポンスを返す
    Rails.logger.error(exception.full_message)
    render_error(code: "internal_server_error", message: "予期せぬエラーが発生しました。", status: :internal_server_error)
  end

  private

  def render_error(code:, message:, status:, details: nil)
    body = { error: { code:, message: } }
    body[:error][:detail] = details if details.present?
    render json: body, status: status
  end
end
