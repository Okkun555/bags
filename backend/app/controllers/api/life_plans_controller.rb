class Api::LifePlansController < ApplicationController
  def index
    authorize LifePlan
    life_plans = policy_scope(LifePlan).order(:start_from, :id)

    render json: LifePlanSerializer.render_as_json(life_plans), status: :ok
  end

  def create
    life_plan = current_user.life_plans.build(life_plan_params)
    authorize life_plan

    life_plan.save!
    render json: LifePlanSerializer.render_as_json(life_plan), status: :created
  end

  private

  def life_plan_params
    params.expect(life_plan: [ :name, :start_from, :end_to ])
  end
end
