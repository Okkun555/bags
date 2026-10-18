class MonthlyPlanDetailSerializer < Blueprinter::Base
  identifier :id
  fields :amount

  association :budget_item, blueprint: BudgetItemSerializer
end
