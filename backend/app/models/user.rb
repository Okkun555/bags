class User < ApplicationRecord
  has_secure_password

  has_one :profile
  has_many :budget_items, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 8 }, allow_nil: true
end
