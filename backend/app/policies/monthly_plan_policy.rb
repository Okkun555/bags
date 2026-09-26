class MonthlyPlanPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    user.present? && user.id == record.user_id
  end

  def create?
    user.present?
  end

  class Scope < Scope
    def resolve
      scope.where(user: user)
    end
  end
end
