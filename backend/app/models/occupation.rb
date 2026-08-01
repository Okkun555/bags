class Occupation < ApplicationRecord
  has_many :profiles

  validates :name, uniqueness: true, length: { maximum: 100 }
  validates :sequence, uniqueness: true, numericality: { only_integer: true }
end
