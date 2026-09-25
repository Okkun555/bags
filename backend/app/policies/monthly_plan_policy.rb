class MonthlyPlanPolicy < ApplicationPolicy


  def create?
    user.present?
  end

  class Scope < Scope
    def resolve
      scope.where(user: user)
    end
  end
end
