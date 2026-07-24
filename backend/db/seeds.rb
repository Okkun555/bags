# 職種マスタ
occupations = [
  { name: "会社員", sequence: 1 },
  { name: "自営業", sequence: 2 },
  { name: "公務員", sequence: 3 },
  { name: "主婦・主夫", sequence: 4 },
  { name: "学生", sequence: 5 },
  { name: "無職", sequence: 6 },
  { name: "その他", sequence: 99 }
]

occupations.each do |occupation|
  Occupation.find_or_create_by!(name: occupation[:name])
end
