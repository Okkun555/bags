class AssetBalance < ApplicationRecord
  belongs_to :asset_account

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :target_date, presence: true, uniqueness: { scope: :asset_account_id }

  def self.bulk_create!(user, attrs_list)
    ActiveRecord::Base.transaction do
      account_ids = attrs_list.map { |attrs| attrs[:asset_account_id] }
      accounts = user.asset_accounts.where(id: account_ids).index_by(&:id)

      attrs_list.each do |attrs|
        asset_account = accounts.fetch(attrs[:asset_account_id].to_i) do
          raise ActiveRecord::RecordNotFound, "asset_account_id=#{attrs[:asset_account_id]} is not found"
        end

        asset_account.asset_balances.create!(
          target_date: attrs[:target_date],
          amount: attrs[:amount],
          )
      end
    end
  end
end
