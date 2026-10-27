class Api::AssetAccountsController < ApplicationController

  def show
    asset_account = AssetAccount.find(params[:id])
    authorize asset_account

    render json: AssetAccountSerializer.render_as_json(asset_account), status: :ok
  end

  def create
    asset_account = current_user.asset_accounts.build(create_asset_account_params)
    authorize asset_account

    asset_account.save!

    render json: AssetAccountSerializer.render_as_json(asset_account), status: :created
  end

  def update
    asset_account = AssetAccount.find(params[:id])
    authorize asset_account

    asset_account.update!(update_asset_account_params)

    render json: AssetAccountSerializer.render_as_json(asset_account), status: :ok
  end

  private

  def create_asset_account_params
    params.expect(asset_account: [:name, :code, :account_type, :memo])
  end

  def update_asset_account_params
    params.expect(asset_account: [:name, :account_type, :memo])
  end
end
