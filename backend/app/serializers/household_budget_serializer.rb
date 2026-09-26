class HouseholdBudgetSerializer < Blueprinter::Base
  identifier :id
  fields :relationship, :income
end