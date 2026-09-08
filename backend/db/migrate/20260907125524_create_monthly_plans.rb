class CreateMonthlyPlans < ActiveRecord::Migration[8.1]
  def change
    create_table :monthly_plans do |t|
      t.references :user, foreign_key: true
      t.string :title, null: false, comment: "月次予算計画のタイトル"
      t.string :description, comment: "説明文"
      t.timestamps
    end

    add_index :monthly_plans, :title, unique: true
  end
end
