class ApplicationController < ActionController::API
  include Authenticatable
  include ActionController::Cookies

  before_action :authorize_request
end
