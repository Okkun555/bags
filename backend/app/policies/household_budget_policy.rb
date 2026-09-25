class HouseholdBudgetPolicy < ApplicationPolicy
  def create?
    user.present? && record.monthly_plan.user_id == user.id
  end
end