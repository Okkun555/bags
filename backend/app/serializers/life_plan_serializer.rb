class LifePlanSerializer < Blueprinter::Base
  identifier :id

  fields :name, :start_from, :end_to
end
