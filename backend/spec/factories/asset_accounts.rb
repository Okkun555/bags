FactoryBot.define do
  factory :asset_account do
    association :user
    name { Faker::Bank.name }
    code { SecureRandom.uuid }
    account_type { AssetAccount.account_types.keys.sample }
    memo { Faker::Lorem.sentence }
  end
end
