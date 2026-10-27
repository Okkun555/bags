class AssetAccountSerializer < Blueprinter::Base
  identifier :id
  fields :name, :code, :memo, :account_type
end