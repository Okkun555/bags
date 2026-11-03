class AssetBalance < ApplicationRecord
  belongs_to :asset_account

  validates :amount, presence: true, numericality: { greater_than: 0 }
end
