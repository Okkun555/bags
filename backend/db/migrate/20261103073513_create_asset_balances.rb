class CreateAssetBalances < ActiveRecord::Migration[8.1]
  def change
    create_table :asset_balances do |t|
      t.references :asset_account, foreign_key: true
      t.date :target_date, null: false, comment: "対象日"
      t.integer :amount, null: false, default: 0, comment: "総額"
      t.timestamps
    end

    add_index :asset_balances, [:asset_account_id, :target_date], unique: true
  end
end
