class Api::LifePlans::FamilyMembersController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    family_members = life_plan.family_members.order(:id)
    render json: FamilyMemberSerializer.render_as_json(family_members), status: :ok
  end

  def create
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    family_member = life_plan.family_members.build(family_member_params)
    authorize family_member

    family_member.save!
    render json: FamilyMemberSerializer.render_as_json(family_member), status: :created
  end

  private

  def family_member_params
    params.expect(family_member: [ :name, :relationship, :birthday ])
  end
end
