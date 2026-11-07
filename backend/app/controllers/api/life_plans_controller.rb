class Api::LifePlansController < ApplicationController
  def index
    authorize LifePlan
    life_plans = policy_scope(LifePlan).order(:start_from, :id)

    render json: LifePlanSerializer.render_as_json(life_plans), status: :ok
  end
end
