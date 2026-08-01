FactoryBot.define do
  factory :prefecture do
    name { Faker::Address.state }
    sequence(:sequence) { |n| n }
  end
end
