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

  def update_monthly_plan_details!(monthly_plan_detail_attrs)
    ActiveRecord::Base.transaction do
      sent_budget_item_ids = monthly_plan_detail_attrs.map { |attr| attr[:budget_item_id].to_i }
      monthly_plan_details.where.not(budget_item_id: sent_budget_item_ids).destroy_all

      # N+1対策として既存レコードを一括取得する
      # 更新するレコード件数が増えるようならupsert_allを検討する
      existing_details = monthly_plan_details.where(budget_item_id: sent_budget_item_ids).index_by(&:budget_item_id)

      monthly_plan_detail_attrs.each do |attrs|
        detail = existing_details[attrs[:budget_item_id].to_i] || monthly_plan_details.build(budget_item_id: attrs[:budget_item_id])
        detail.assign_attributes(attrs.except(:budget_item_id))
        detail.save! if detail.changed?
      end
    end
  end
end
