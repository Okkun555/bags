class IncomePolicy < ApplicationPolicy
  def create?
    owner?
  end

  def update?
    owner?
  end

  def destroy?
    owner?
  end

  private

  def owner?
    user.present? && record.life_plan.user_id == user.id
  end

  class Scope < Scope
    def resolve
      scope.joins(:life_plan).where(life_plans: { user_id: user.id })
    end
  end
end
