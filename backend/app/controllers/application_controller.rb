class ApplicationController < ActionController::API
  include Authenticatable
  include ActionController::Cookies
  include Pundit::Authorization

  before_action :authorize_request

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden_error

  private

  def render_error(code:, message:, status:, details: nil)
    body = { error: { code:, message: } }
    body[:error][:detail] = details if details.present?
    render json: body, status: status
  end

  def render_bad_request(message)
    render_error(code: "bad_request", message: message, status: :bad_request)
  end

  def render_forbidden_error
    render_error(code: "forbidden", message: "この操作を行う権限がありません", status: :forbidden)
  end

  # 409 Conflict Error
  def render_conflict(message)
    render_error(code: "conflict", message:, status: :conflict)
  end

  def render_not_found(exception)
    message = exception.model&.constantize&.model_name&.human || "リソース"
    render_error(code: "not_found", message:, status: :not_found)
  end
end
