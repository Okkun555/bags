class AddUniqueIndexForMeAndSpouseToFamilyMembers < ActiveRecord::Migration[8.1]
  def change
    # 本人・配偶者はライフプランにつき1人まで
    add_index :family_members, [ :life_plan_id, :relationship ],
      unique: true,
      where: "relationship IN ('me', 'spouse')",
      name: "index_family_members_on_life_plan_id_and_me_or_spouse"
  end
end
