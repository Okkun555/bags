class InvestmentSerializer < Blueprinter::Base
  identifier :id

  fields :family_member_id, :investment_type, :amount, :start_from, :end_to, :memo
end
