class Api::MonthlyPlans::MonthlyPlanDetailsController < ApplicationController
  before_action :set_monthly_plan

  def update
    @monthly_plan.update_monthly_plan_details!(monthly_plan_detail_params)

    render json: {}, status: :ok
  end

  private

  def monthly_plan_detail_params
    params.expect(monthly_plan_details: [[:budget_item_id, :amount]]).map(&:to_h)
  end

  def set_monthly_plan
    @monthly_plan = policy_scope(MonthlyPlan).find(params[:monthly_plan_id])
  end
end
