FactoryBot.define do
  factory :family_member do
    association :life_plan
    name { Faker::Name.name }
    relationship { "me" }
    birthday { Faker::Date.birthday(min_age: 20, max_age: 60) }
  end
end
