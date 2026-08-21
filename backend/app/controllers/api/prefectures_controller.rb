class Api::PrefecturesController < ApplicationController
  def index
    prefectures = Prefecture.all.order(:sequence)

    render json: PrefectureSerializer.render_as_json(prefectures), status: :ok
  end
end
