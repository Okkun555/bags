class LifePlan < ApplicationRecord
  belongs_to :user

  with_options dependent: :destroy do
    # family_members より先に収入・投資を削除する必要があるため、この順序を維持する
    has_many :incomes
    has_many :investments
    has_many :family_members
  end

  validates :name, presence: true, length: { maximum: 100 }, uniqueness: { scope: :user_id }
  validates :start_from, presence: true, numericality: { only_integer: true }
  validates :end_to, numericality: { only_integer: true, greater_than_or_equal_to: :start_from }, allow_nil: true
end
