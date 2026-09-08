class MonthlyPlan < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :description, length: { maximum: 500 }, allow_blank: true
end
