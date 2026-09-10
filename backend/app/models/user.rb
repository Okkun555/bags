class User < ApplicationRecord
  has_secure_password

  has_one :profile

  with_options dependent: :destroy do
    has_many :budget_items
    has_many :monthly_plans
  end

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 8 }, allow_nil: true
end
