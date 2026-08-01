FactoryBot.define do
  factory :occupation do
    name { Faker::Job.title }
    sequence(:sequence) { |n| n }
  end
end
