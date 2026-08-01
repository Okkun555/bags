class Profile < ApplicationRecord
  belongs_to :user
  has_one :prefecture
  has_one :occupation

  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
  validates :date_of_birth, presence: true
  validate :date_of_birth_cannot_be_in_the_feature
  validate :date_of_must_be_realistic
  validates :gender, presence: true, inclusion: { in: %w[male female other] }
  validates :marital_status, presence: true, inclusion: { in: %w[single married living_with_parents other] }
  validates :income, presence: true, inclusion: { in: %w[under_200 from_200_to_400 from_400_to_600 from_800_to_1000 from_1000_to_1500 from_1500_to_2000 over_2000] }

  enum :gender, { male: 0, female: 1, other: 2 }, prefix: true
  enum :marital_status, { single: 0, married: 1, living_with_parents: 2, other: 3 }, prefix: true
  enum :income, {
    under_200:        0, # 200万円未満
    from_200_to_400:  1, # 200~400万円未満
    from_400_to_600:  2, # 400~600万円未満
    from_600_to_800:  3, # 600~800万円未満
    from_800_to_1000: 4, # 800~1000万円未満
    from_1000_to_1500: 5, # 1000~1500万円未満
    from_1500_to_2000: 6, # 1500~2000万円未満
    over_2000:         7  # 2000万円以上
  }

  private

  def date_of_birth_cannot_be_in_the_feature
    return if date_of_birth.blank?

    if date_of_birth > Date.current
      errors.add(:date_of_birth, "は未来の日付にできません")
    end
  end

  def date_of_must_be_realistic
    return if date_of_birth.blank?

    if date_of_birth < 150.years.ago.to_date
      errors.add(:date_of_birth, "が正しくありません")
    end
  end
end
