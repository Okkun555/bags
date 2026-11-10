class Api::LifePlans::InvestmentsController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    investments = life_plan.investments.order(:start_from, :id)
    render json: InvestmentSerializer.render_as_json(investments), status: :ok
  end

  def destroy
    investment = policy_scope(Investment).where(life_plan_id: params[:life_plan_id]).find(params[:id])
    authorize investment

    investment.destroy!
    render json: InvestmentSerializer.render_as_json(investment), status: :ok
  end
end
