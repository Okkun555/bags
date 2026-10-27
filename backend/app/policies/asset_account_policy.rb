class AssetAccountPolicy < ApplicationPolicy
  def create?
    user.present?
  end
end