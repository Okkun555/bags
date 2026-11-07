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

  def update
    family_member = find_family_member
    authorize family_member

    family_member.update!(family_member_params)
    render json: FamilyMemberSerializer.render_as_json(family_member), status: :ok
  end

  def destroy
    family_member = find_family_member
    authorize family_member

    # MEMO: 収入・投資が紐づく場合は削除できない(dependent: :restrict_with_error)
    return render_conflict(I18n.t("errors.family_member.has_dependents")) unless family_member.destroy

    render json: FamilyMemberSerializer.render_as_json(family_member), status: :ok
  end

  private

  def find_family_member
    policy_scope(FamilyMember).where(life_plan_id: params[:life_plan_id]).find(params[:id])
  end

  def family_member_params
    params.expect(family_member: [ :name, :relationship, :birthday ])
  end
end
