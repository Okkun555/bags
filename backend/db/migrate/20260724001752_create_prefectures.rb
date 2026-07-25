class CreatePrefectures < ActiveRecord::Migration[8.1]
  def change
    create_table :prefectures do |t|
      t.string :name, null: false, comment: "都道府県名"
      t.integer :sequence, null: false, comment: "並び順"
      t.timestamps
    end

    add_index :prefectures, :name, unique: true
    add_index :prefectures, :sequence, unique: true
  end
end
