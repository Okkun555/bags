class MonthlyPlanSerializer < Blueprinter::Base
  identifier :id
  fields :title, :description, :created_at, :updated_at

  view :detail do
    # association :budget_items, blueprint: BudgetItemSerializer

    association :household_budgets, blueprint: HouseholdBudgetSerializer
    association :monthly_plan_details, blueprint: MonthlyPlanDetailSerializer

    field :total_income do |option|
      option.household_budgets.sum(&:income)
    end
  end
end
