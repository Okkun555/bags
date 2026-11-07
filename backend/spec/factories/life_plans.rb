FactoryBot.define do
  factory :life_plan do
    association :user
    sequence(:name) { |n| "ライフプラン#{n}" }
    start_from { 2026 }
    end_to { nil }
  end
end
