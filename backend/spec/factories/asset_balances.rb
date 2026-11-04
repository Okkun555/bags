FactoryBot.define do
  factory :asset_balance do
    association :asset_account
    target_date { Faker::Date.backward(days: 31) }
    amount { 1000 }
  end
end
