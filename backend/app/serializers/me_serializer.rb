class MeSerializer < Blueprinter::Base
  identifier :id

  field :email

  association :profile, blueprint: ProfileSerializer
end
