# 収入・投資など、ライフプラン内の家族メンバーに紐づくレコードの共通処理
module BelongsToLifePlanMember
  extend ActiveSupport::Concern

  included do
    belongs_to :life_plan
    belongs_to :family_member

    validates :amount, presence: true, numericality: { only_integer: true, greater_than: 0 }
    validates :start_from, presence: true, numericality: { only_integer: true }
    validates :end_to, numericality: { only_integer: true, greater_than_or_equal_to: :start_from }, allow_nil: true
    validates :memo, length: { maximum: 400 }
    validate :family_member_belongs_to_life_plan
  end

  private

  def family_member_belongs_to_life_plan
    return if family_member.nil? || life_plan.nil?

    errors.add(:family_member, "は同じライフプランのメンバーを指定してください") if family_member.life_plan_id != life_plan_id
  end
end
