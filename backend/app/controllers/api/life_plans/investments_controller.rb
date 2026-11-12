class Api::LifePlans::InvestmentsController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    investments = life_plan.investments.order(:start_from, :id)
    render json: InvestmentSerializer.render_as_json(investments), status: :ok
  end

  def create
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    investment = life_plan.investments.build(investment_params.except(:family_member_id).merge(family_member: find_family_member(life_plan)))
    authorize investment

    investment.save!
    render json: InvestmentSerializer.render_as_json(investment), status: :created
  end

  def update
    investment = find_investment
    authorize investment

    # MEMO: メンバーの付け替えも同じライフプラン配下に限定する
    investment.update!(investment_params.except(:family_member_id).merge(family_member: find_family_member(investment.life_plan)))
    render json: InvestmentSerializer.render_as_json(investment), status: :ok
  end

  def destroy
    investment = find_investment
    authorize investment

    investment.destroy!
    render json: InvestmentSerializer.render_as_json(investment), status: :ok
  end

  private

  def find_investment
    policy_scope(Investment).where(life_plan_id: params[:life_plan_id]).find(params[:id])
  end

  # MEMO: 他のライフプランのメンバーIDを送られても404で弾く
  def find_family_member(life_plan)
    life_plan.family_members.find(investment_params[:family_member_id])
  end

  def investment_params
    params.expect(investment: [ :family_member_id, :investment_type, :amount, :start_from, :end_to, :memo ])
  end
end
