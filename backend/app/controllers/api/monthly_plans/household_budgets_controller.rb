class Api::MonthlyPlans::HouseholdBudgetsController < ApplicationController
  before_action :set_monthly_plan

  def update
    @monthly_plan.update_household_budgets!(household_budget_params)

    render json: {}, status: :ok
  end

  private

  def set_monthly_plan
    @monthly_plan = policy_scope(MonthlyPlan).find(params[:monthly_plan_id])
  end

  def household_budget_params
    params.expect(household_budgets: [[:id, :relationship, :income]]).map(&:to_h)
  end
end
