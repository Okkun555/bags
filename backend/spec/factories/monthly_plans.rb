FactoryBot.define do
  factory :monthly_plan do
    association :user

    sequence(:title) { |n| "#{Faker::Date.forward(days: 30).strftime('%Y年%m月')}計画#{n}" }
    description { Faker::Lorem.sentence }

    trait :without_description do
      description { nil }
    end
  end
end
