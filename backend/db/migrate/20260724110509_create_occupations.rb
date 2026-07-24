class CreateOccupations < ActiveRecord::Migration[8.1]
  def change
    create_table :occupations do |t|
      t.string :name, null: false, comment: "職業名"
      t.t.integer :sequence, null: false, limit: 2, comment: "並び順"

      t.timestamps
    end

    add_index :occupations, :name, unique: true
  end
end
