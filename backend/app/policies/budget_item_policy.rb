class BudgetItemPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user.present?
  end

  def destroy?
    user.present? && record.custom? && owner?
  end

  private

  def owner?
    record.user_id == user.id
  end
end
