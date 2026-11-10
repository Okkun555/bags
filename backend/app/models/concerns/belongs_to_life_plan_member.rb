# 収入・投資など、ライフプラン内の家族メンバーに紐づくレコードの共通処理
module BelongsToLifePlanMember
  extend ActiveSupport::Concern

  included do
    belongs_to :life_plan
    belongs_to :family_member

    validates :amount, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 2_147_483_647 }
    validates :start_from, presence: true, numericality: { only_integer: true }
    validates :end_to, numericality: { only_integer: true, greater_than_or_equal_to: :start_from }, allow_nil: true
    validates :memo, length: { maximum: 400 }
    validate :family_member_belongs_to_life_plan
  end

  # 入力額の区分。月額の場合は×12して年額で保存する
  AMOUNT_TYPES = %w[monthly annual].freeze

  class_methods do
    # 入力額を年額に変換する。数値として解釈できない値はそのまま返し、バリデーションに任せる
    def to_annual_amount(amount, amount_type)
      return amount unless amount_type == "monthly"

      value = Integer(amount.to_s, exception: false)
      value.nil? ? amount : value * 12
    end
  end

  private

  def family_member_belongs_to_life_plan
    return if family_member.nil? || life_plan.nil?

    errors.add(:family_member, "は同じライフプランのメンバーを指定してください") if family_member.life_plan_id != life_plan_id
  end
end
