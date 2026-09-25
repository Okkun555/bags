class HouseholdBudget < ApplicationRecord
  belongs_to :monthly_plan

  enum :relationship, {
    me: "me", # 本人
    spouse: "spouse", # 夫 or 妻
    father: "father", # 父
    mother: "mother", # 母
    child: "child", # 子
    other: "other" # その他
  }
end
