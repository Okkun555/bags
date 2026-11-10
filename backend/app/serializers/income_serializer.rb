class IncomeSerializer < Blueprinter::Base
  identifier :id

  fields :family_member_id, :income_type, :amount, :start_from, :end_to, :memo
end
