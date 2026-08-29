class CreateBudgetItems < ActiveRecord::Migration[8.1]
  def change
    create_table :budget_items do |t|
      t.references :user, foreign_key: true, null: true
      t.string :name, null: false, comment: "項目名"
      t.string :type, null: false, default: "fixed", comment: "予算種別(fixed:固定費, variable:変動費)"
      t.timestamps
    end

    add_check_constraint :budget_items,
                         "type IN ('fixed', 'variable')",
                         name: "budget_items_type_check"
    add_index :budget_items, [:user_id, :name], unique: true
  end
end
