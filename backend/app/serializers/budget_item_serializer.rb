class BudgetItemSerializer < Blueprinter::Base
  identifier :id
  fields :name, :type

  field :operable do |option|
    option.user_id.present? ? true : false
  end
end
