class Income < ApplicationRecord
  include BelongsToLifePlanMember

  enum :income_type, {
    salary: "salary", # 給与
    dividend: "dividend", # 配当金
    side_job: "side_job", # 副業
    bonus: "bonus", # 賞与
    windfall: "windfall", # 臨時収入
  }, validate: true

  validates :income_type, presence: true
end
