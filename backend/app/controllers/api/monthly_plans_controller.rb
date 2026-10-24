class Api::MonthlyPlansController < ApplicationController
  def index
    pagy, records = pagy(:offset, current_user.monthly_plans.order(created_at: :desc))

    render json: {
      data: MonthlyPlanSerializer.render_as_json(records),
      pagination: PaginationSerializer.render_as_json(pagy)
    }, status: :ok
  end

  def show
    monthly_plan = policy_scope(MonthlyPlan)
                     .includes(:household_budgets, :monthly_plan_details)
                     .find(params[:id])
    authorize monthly_plan

    render json: MonthlyPlanSerializer.render_as_json(monthly_plan, view: :detail), status: :ok
  end

  def create
    monthly_plan = current_user.monthly_plans.build(monthly_plan_params)
    authorize monthly_plan

    if monthly_plan.save_with_details!
      render json: MonthlyPlanSerializer.render_as_json(monthly_plan), status: :created
    end
  end

  def destroy
    monthly_plan = current_user.monthly_plans.find(params[:id])
    authorize monthly_plan
    monthly_plan.destroy!

    render json: MonthlyPlanSerializer.render_as_json(monthly_plan), status: :ok
  end

  private

  def monthly_plan_params
    params.expect(monthly_plan: [ :title, :description ])
  end
end
