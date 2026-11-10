class Income < ApplicationRecord
  include BelongsToLifePlanMember

  enum :income_type, {
    salary: "salary", # 給与
    dividend: "dividend", # 配当金
    side_job: "side_job", # 副業
    bonus: "bonus", # 賞与
    windfall: "windfall", # 臨時収入
  }, validate: true

  # 入力額の区分。月額の場合は×12して年額で保存する
  AMOUNT_TYPES = %w[monthly annual].freeze

  validates :income_type, presence: true

  # 入力額を年額に変換する。数値として解釈できない値はそのまま返し、バリデーションに任せる
  def self.to_annual_amount(amount, amount_type)
    return amount unless amount_type == "monthly"

    value = Integer(amount.to_s, exception: false)
    value.nil? ? amount : value * 12
  end
end
