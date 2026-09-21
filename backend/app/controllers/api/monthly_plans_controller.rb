class Api::MonthlyPlansController < ApplicationController
  def index
    pagy, records = pagy(:offset, current_user.monthly_plans.order(created_at: :desc))

    render json: {
      data: MonthlyPlanSerializer.render_as_json(records),
      pagination: PaginationSerializer.render_as_json(pagy)
    }, status: :ok
  end

  def create
    monthly_plan = current_user.monthly_plans.build(monthly_plan_params)
    authorize monthly_plan

    if monthly_plan.save!
      render json: MonthlyPlanSerializer.render_as_json(monthly_plan), status: :created
    end
  end

  private

  def monthly_plan_params
    params.expect(monthly_plan: [ :title, :description ])
  end
end
