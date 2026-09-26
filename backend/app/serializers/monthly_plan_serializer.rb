class MonthlyPlanSerializer < Blueprinter::Base
  identifier :id
  fields :title, :description, :created_at, :updated_at

  view :detail do
    # association :budget_items, blueprint: BudgetItemSerializer
    association :household_budgets, blueprint: HouseholdBudgetSerializer
  end
end
