class MonthlyPlan < ApplicationRecord
  belongs_to :user

  has_many :household_budgets
  has_many :monthly_plan_details

  validates :title, presence: true, uniqueness: { scope: :user_id }
  validates :description, length: { maximum: 500 }, allow_blank: true

  # household_budgets_attrs
  # {
  #   "id" => nil | intger,
  #   "relationship" => enum,
  #   "income" => integer,
  # }
  def update_household_budgets!(household_budgets_attrs)
    ActiveRecord::Base.transaction do
      sent_ids = household_budgets_attrs.filter_map { |attr| attr[:id] }
      household_budgets.where.not(id: sent_ids).destroy_all

      household_budgets_attrs.each do |attrs|
        if attrs[:id].present?
          household_budget = household_budgets.find(attrs[:id])
          household_budget.assign_attributes(attrs.except(:id))
          household_budget.save! if household_budget.changed?
        else
          household_budgets.create!(attrs.except(:id))
        end
      end
    end
  end
end
