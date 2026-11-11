class Api::LifePlans::IncomesController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    incomes = life_plan.incomes.order(:start_from, :id)
    render json: IncomeSerializer.render_as_json(incomes), status: :ok
  end

  def create
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    income = life_plan.incomes.build(income_params.except(:family_member_id).merge(family_member: find_family_member(life_plan)))
    authorize income

    income.save!
    render json: IncomeSerializer.render_as_json(income), status: :created
  end

  def update
    income = find_income
    authorize income

    # MEMO: メンバーの付け替えも同じライフプラン配下に限定する
    income.update!(income_params.except(:family_member_id).merge(family_member: find_family_member(income.life_plan)))
    render json: IncomeSerializer.render_as_json(income), status: :ok
  end

  def destroy
    income = find_income
    authorize income

    income.destroy!
    render json: IncomeSerializer.render_as_json(income), status: :ok
  end

  private

  def find_income
    policy_scope(Income).where(life_plan_id: params[:life_plan_id]).find(params[:id])
  end

  # MEMO: 他のライフプランのメンバーIDを送られても404で弾く
  def find_family_member(life_plan)
    life_plan.family_members.find(income_params[:family_member_id])
  end

  def income_params
    params.expect(income: [ :family_member_id, :income_type, :amount, :start_from, :end_to, :memo ])
  end
end
