class CreateLifePlans < ActiveRecord::Migration[8.1]
  def change
    create_table :life_plans do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false, comment: "ライフプラン名"
      t.integer :start_from, null: false, comment: "開始年"
      t.integer :end_to, comment: "終了年"
      t.timestamps
    end

    add_index :life_plans, [ :user_id, :name ], unique: true
  end
end
