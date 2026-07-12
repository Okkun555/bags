class Api::MeController < ApplicationController
  def show
    render json: MeSerializer.render_as_json(current_user), status: :ok
  end
end
