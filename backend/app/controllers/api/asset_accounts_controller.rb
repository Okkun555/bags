class Api::AssetAccountsController < ApplicationController
  def create
    asset_account = current_user.asset_accounts.build(asset_account_params)
    authorize asset_account

    asset_account.save!

    render json: AssetAccountSerializer.render_as_json(asset_account), status: :created
  end

  private

  def asset_account_params
    params.expect(asset_account: [:name, :code, :account_type, :memo])
  end
end
