class CreateIncomes < ActiveRecord::Migration[8.1]
  def change
    create_table :incomes do |t|
      t.references :life_plan, null: false, foreign_key: true
      t.references :family_member, null: false, foreign_key: true
      t.string :income_type, null: false, comment: "収入種別(salary:給与, dividend:配当金, side_job:副業, bonus:賞与, windfall:臨時収入)"
      t.integer :amount, null: false, comment: "収入額"
      t.integer :start_from, null: false, comment: "開始年"
      t.integer :end_to, comment: "終了年(NULLは期限なし)"
      t.string :memo, comment: "備考"
      t.timestamps
    end

    add_check_constraint :incomes,
      "income_type IN ('salary', 'dividend', 'side_job', 'bonus', 'windfall')",
      name: "incomes_income_type_check"
    add_check_constraint :incomes, "amount > 0", name: "incomes_amount_check"
    add_check_constraint :incomes, "end_to IS NULL OR start_from <= end_to", name: "incomes_period_check"
  end
end
