class FamilyMemberSerializer < Blueprinter::Base
  identifier :id

  fields :name, :relationship, :birthday
end
