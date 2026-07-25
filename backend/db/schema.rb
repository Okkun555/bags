# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_24_110725) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "occupations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false, comment: "職業名"
    t.integer "sequence", limit: 2, null: false, comment: "並び順"
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_occupations_on_name", unique: true
  end

  create_table "prefectures", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false, comment: "都道府県名"
    t.integer "sequence", null: false, comment: "並び順"
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_prefectures_on_name", unique: true
    t.index ["sequence"], name: "index_prefectures_on_sequence", unique: true
  end

  create_table "profiles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_of_birth", null: false, comment: "生年月日"
    t.integer "gender", default: 0, null: false, comment: "性別(0:男性,1:女性,2:その他)"
    t.integer "income", comment: "年収(0:200万円未満, 1:200~400万円未満, 2:400~600万円未満, 3:600~800万円未満, 4:800~1000万円未満, 5:1000~1500万円未満, 6:1500~2000万円未満, 7:2000万円以上"
    t.integer "marital_status", default: 0, null: false, comment: "家族形態(0:独身, 1:既婚, 2:親と同居, 3:その他)"
    t.string "name", null: false, comment: "アカウント名"
    t.bigint "occupation_id"
    t.bigint "prefecture_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["name"], name: "index_profiles_on_name"
    t.index ["occupation_id"], name: "index_profiles_on_occupation_id"
    t.index ["prefecture_id"], name: "index_profiles_on_prefecture_id"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "profiles", "occupations"
  add_foreign_key "profiles", "prefectures"
  add_foreign_key "profiles", "users"
end
