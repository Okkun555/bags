class BudgetItem < ApplicationRecord
  # typeカラムをSTI用として使わないように設定
  self.inheritance_column = :_type_disabled

  belongs_to :user, optional: true

  validates :name, presence: true, length: { maximum: 100 }

  before_update :forbidden_default_item_update, if: :default_item?
  before_destroy :forbidden_default_item_destroy, if: :default_item?

  enum :type, { fixed: "fixed", variable: "variable" }, validate: true

  scope :default_items, -> { where(user_id: nil) }
  scope :available_items, ->(user:) {
    where(user_id: [ nil, user.id ])
      .order(
        Arel.sql("CASE type WHEN 'fixed' THEN 0 ELSE 1 END"),
        Arel.sql("CASE WHEN user_id IS NULL THEN 0 ELSE 1 END"),
        :name,
        )
  }

  def custom?
    self.user.present?
  end

  private

  def forbidden_default_item_update
    errors.add(:base, "デフォルト項目は編集できません")
    throw :abort
  end

  def forbidden_default_item_destroy
    errors.add(:base, "デフォルト項目は削除できません")
    throw :abort
  end

  def default_item?
    user_id_was.nil? || user_id.nil?
  end
end
