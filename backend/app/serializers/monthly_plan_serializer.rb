class MonthlyPlanSerializer < Blueprinter::Base
  identifier :id
  fields :title, :description, :created_at, :updated_at
end
