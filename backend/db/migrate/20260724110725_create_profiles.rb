class CreateProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :profiles do |t|
      t.references :user, foreign_key: true
      t.string :name, null: false, comment: "アカウント名"
      t.date :date_of_birth, null: false, comment: "生年月日"
      t.integer :gender, null: false, default: 0, comment: "性別(0:男性,1:女性,2:その他)"
      t.integer :marital_status, null: false, default: 0, comment: "家族形態(0:独身, 1:既婚, 2:親と同居, 3:その他)"
      t.references :occupation, foreign_key: true
      t.references :prefecture, foreign_key: true
      t.integer :income, null: true, comment: "年収(0:200万円未満, 1:200~400万円未満, 2:400~600万円未満, 3:600~800万円未満, 4:800~1000万円未満, 5:1000~1500万円未満, 6:1500~2000万円未満, 7:2000万円以上"

      t.timestamps
    endz

    add_index :profiles, :name
  end
end
