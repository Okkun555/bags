class CreateInvestments < ActiveRecord::Migration[8.1]
  def change
    create_table :investments do |t|
      t.references :life_plan, null: false, foreign_key: true
      t.references :family_member, null: false, foreign_key: true
      t.string :investment_type, null: false, comment: "投資種別(stock:株式, insurance:保険)"
      t.integer :amount, null: false, comment: "金額"
      t.integer :start_from, null: false, comment: "開始年"
      t.integer :end_to, comment: "終了年(NULLは期限なし)"
      t.string :memo, comment: "備考"
      t.timestamps
    end

    add_check_constraint :investments,
      "investment_type IN ('stock', 'insurance')",
      name: "investments_investment_type_check"
    add_check_constraint :investments, "amount > 0", name: "investments_amount_check"
    add_check_constraint :investments, "end_to IS NULL OR start_from <= end_to", name: "investments_period_check"
  end
end
