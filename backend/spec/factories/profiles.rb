FactoryBot.define do
  factory :profile do
    association :user

    name { Faker::Name.name }
    date_of_birth { Faker::Date.birthday(min_age: 20, max_age: 60) }
    gender { Profile.genders.keys.sample }
    marital_status { Profile.marital_statuses.keys.sample }
    income { Profile.incomes.keys.sample }
  end
end
