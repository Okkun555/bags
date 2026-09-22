class CreateHouseholdBudgets < ActiveRecord::Migration[8.1]
  def change
    create_table :household_budgets do |t|
      t.references :monthly_plan, null: false, foreign_key: true
      t.string :relationship, null: false, default: "me", comment: "続柄"
      t.integer :income, null: false, comment: "収入"

      t.timestamps
    end

    add_check_constraint :household_budgets,
                         "relationship IN ('me', 'spouse', 'father', 'mother', 'child', 'other')",
                         name: "household_budgets_relationship_check"
  end
end
