class MonthlyPlanDetail < ApplicationRecord
  belongs_to :monthly_plan

  validates :budget_item_id, uniqueness: { scope: :monthly_plan_id }
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
