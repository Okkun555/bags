FactoryBot.define do
  factory :household_budget do
    association :monthly_plan
    relationship { "me" }
    income { Faker::Number.between(from: 200_000, to: 600_000) }

    trait :spouse do
      relationship { "spouse" }
    end

    trait :father do
      relationship { "father" }
    end

    trait :mother do
      relationship { "mother" }
    end

    trait :child do
      relationship { "child" }
    end

    trait :other do
      relationship { "other" }
    end
  end
end
