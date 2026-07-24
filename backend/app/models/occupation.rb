class Occupation < ApplicationRecord
  validates :name, uniqueness: true, length: { maximum: 100 }
  validates :sequence, uniqueness: true, numericality: { only_integer: true }
end
