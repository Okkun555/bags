FactoryBot.define do
  factory :monthly_plan_detail do
    association :monthly_plan
    association :budget_item
    amount { Faker::Number.between(from: 0, to: 50_000) }
  end
end
