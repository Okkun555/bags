class MonthlyPlan < ApplicationRecord
  belongs_to :user

  has_many :household_budgets
  has_many :monthly_plan_details

  validates :title, presence: true, uniqueness: { scope: :user_id }
  validates :description, length: { maximum: 500 }, allow_blank: true
end
