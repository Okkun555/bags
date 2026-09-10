class MonthlyPlanPolicy < ApplicationPolicy
  def create?
    user.present?
  end
end
