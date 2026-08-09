class ProfileSerializer < Blueprinter::Base
  identifier :id

  fields :name, :date_of_birth, :gender, :marital_status, :income
end
