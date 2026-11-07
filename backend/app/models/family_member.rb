class FamilyMember < ApplicationRecord
  belongs_to :life_plan

  with_options dependent: :restrict_with_error do
    has_many :incomes
    has_many :investments
  end

  enum :relationship, {
    me: "me", # 本人
    spouse: "spouse", # 配偶者
    mother: "mother", # 母
    father: "father", # 父
    child: "child", # 子
    other: "other", # その他
  }, validate: true

  validates :name, presence: true, length: { maximum: 100 }
  validates :relationship, presence: true
  validates :birthday, presence: true
end
