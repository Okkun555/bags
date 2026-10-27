class CreateAssetAccounts < ActiveRecord::Migration[8.1]
  def change
    create_table :asset_accounts do |t|
      t.references :user, foreign_key: true
      t.string :name, comment: "口座名"
      t.string :code, comment: "口座コード"
      t.string :account_type, null: false, default: "cash", comment: "口座タイプ"
      t.string :memo, comment: "備考"
      t.timestamps
    end

    add_check_constraint :asset_accounts,
                         "account_type IN ('cash', 'bank', 'securities', 'insurance', 'pension', 'other')",
                         name: "asset_accounts_account_type_check"

    add_index :asset_accounts, [:user_id, :code], unique: true
  end
end
