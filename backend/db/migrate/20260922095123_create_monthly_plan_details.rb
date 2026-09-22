class CreateMonthlyPlanDetails < ActiveRecord::Migration[8.1]
  def change
    create_table :monthly_plan_details do |t|
      t.references :monthly_plan, null: false, foreign_key: true
      t.references :budget_item, null: false, foreign_key: true
      t.integer :amount, null: false, default: 0, comment: "金額"
      t.timestamps
    end

    add_index :monthly_plan_details, [ :monthly_plan_id, :budget_item_id ], unique: true
    add_check_constraint :monthly_plan_details, "amount >= 0", name: "monthly_plan_details_amount_check"
  end
end
