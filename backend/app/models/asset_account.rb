class AssetAccount < ApplicationRecord
  belongs_to :user

  enum :account_type, {
    cash: "cash", # 現金
    bank: "bank", # 銀行
    securities: "securities", # 証券
    insurance: "insurance", # 保険
    pension: "pension", # 年金
    other: "other", # その他
  }, default: :cash

  validates :name, presence: true, length: { maximum: 100 }
  validates :code, presence: true, length: { maximum: 100 }, uniqueness: { scope: :user_id }
  validates :memo, length: { maximum: 400 }
end
