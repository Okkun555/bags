class Api::AssetBalancesController < ApplicationController
  def create
    AssetBalance.bulk_create!(current_user, create_asset_balances_params)

    render json: {}, status: :created
  end

  private

  def create_asset_balances_params
    params.expect(asset_balance: [[:asset_account_id, :target_date, :amount]]).map(&:to_h)
  end
end
