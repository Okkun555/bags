class Api::LifePlans::IncomesController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    incomes = life_plan.incomes.order(:start_from, :id)
    render json: IncomeSerializer.render_as_json(incomes), status: :ok
  end

  def destroy
    income = policy_scope(Income).where(life_plan_id: params[:life_plan_id]).find(params[:id])
    authorize income

    income.destroy!
    render json: IncomeSerializer.render_as_json(income), status: :ok
  end
end
