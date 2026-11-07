class Investment < ApplicationRecord
  include BelongsToLifePlanMember

  enum :investment_type, {
    stock: "stock", # 株式
    insurance: "insurance", # 保険
  }

  validates :investment_type, presence: true
end
