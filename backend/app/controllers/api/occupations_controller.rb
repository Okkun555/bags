class Api::OccupationsController < ApplicationController
  def index
    occupations = Occupation.all.order(:sequence)

    render json: OccupationSerializer.render_as_json(occupations), status: :ok
  end
end
