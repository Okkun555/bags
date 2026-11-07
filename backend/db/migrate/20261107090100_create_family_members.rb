class CreateFamilyMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :family_members do |t|
      t.references :life_plan, null: false, foreign_key: true
      t.string :name, null: false, comment: "名前"
      t.string :relationship, null: false, comment: "続柄(me:本人, spouse:配偶者, mother:母, father:父, child:子, other:その他)"
      t.date :birthday, null: false, comment: "生年月日"
      t.timestamps
    end

    add_check_constraint :family_members,
      "relationship IN ('me', 'spouse', 'mother', 'father', 'child', 'other')",
      name: "family_members_relationship_check"
  end
end
