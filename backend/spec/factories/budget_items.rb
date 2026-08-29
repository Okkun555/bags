FactoryBot.define do
  factory :budget_item do
    association :user

    name { Faker::Commerce.department }
    type { BudgetItem.types.keys.sample }
  end
end
