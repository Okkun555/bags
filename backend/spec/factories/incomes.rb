FactoryBot.define do
  factory :income do
    life_plan
    family_member { association :family_member, life_plan: }
    income_type { "salary" }
    amount { 3_000_000 }
    start_from { 2026 }
    end_to { 2030 }
    memo { nil }
  end
end
