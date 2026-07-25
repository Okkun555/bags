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
  Occupation.find_or_create_by!(name: occupation[:name], sequence: occupation[:sequence])
end

# 都道府県マスタ
prefectures = [
  { name: "北海道", sequence: 1 },
  { name: "青森県", sequence: 2 },
  { name: "岩手県", sequence: 3 },
  { name: "宮城県", sequence: 4 },
  { name: "秋田県", sequence: 5 },
  { name: "山形県", sequence: 6 },
  { name: "福島県", sequence: 7 },
  { name: "茨城県", sequence: 8 },
  { name: "栃木県", sequence: 9 },
  { name: "群馬県", sequence: 10 },
  { name: "埼玉県", sequence: 11 },
  { name: "千葉県", sequence: 12 },
  { name: "東京都", sequence: 13 },
  { name: "神奈川県", sequence: 14 },
  { name: "新潟県", sequence: 15 },
  { name: "富山県", sequence: 16 },
  { name: "石川県", sequence: 17 },
  { name: "福井県", sequence: 18 },
  { name: "山梨県", sequence: 19 },
  { name: "長野県", sequence: 20 },
  { name: "岐阜県", sequence: 21 },
  { name: "静岡県", sequence: 22 },
  { name: "愛知県", sequence: 23 },
  { name: "三重県", sequence: 24 },
  { name: "滋賀県", sequence: 25 },
  { name: "京都府", sequence: 26 },
  { name: "大阪府", sequence: 27 },
  { name: "兵庫県", sequence: 28 },
  { name: "奈良県", sequence: 29 },
  { name: "和歌山県", sequence: 30 },
  { name: "鳥取県", sequence: 31 },
  { name: "島根県", sequence: 32 },
  { name: "岡山県", sequence: 33 },
  { name: "広島県", sequence: 34 },
  { name: "山口県", sequence: 35 },
  { name: "徳島県", sequence: 36 },
  { name: "香川県", sequence: 37 },
  { name: "愛媛県", sequence: 38 },
  { name: "高知県", sequence: 39 },
  { name: "福岡県", sequence: 40 },
  { name: "佐賀県", sequence: 41 },
  { name: "長崎県", sequence: 42 },
  { name: "熊本県", sequence: 43 },
  { name: "大分県", sequence: 44 },
  { name: "宮崎県", sequence: 45 },
  { name: "鹿児島県", sequence: 46 },
  { name: "沖縄県", sequence: 47 },
  { name: "海外", sequence: 99 }
]

prefectures.each do |prefecture|
  Prefecture.find_or_create_by!(name: prefecture[:name], sequence: prefecture[:sequence])
end
