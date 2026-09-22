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

ActiveRecord::Schema[8.1].define(version: 2026_09_22_095123) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "budget_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false, comment: "項目名"
    t.string "type", default: "fixed", null: false, comment: "予算種別(fixed:固定費, variable:変動費)"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id", "name"], name: "index_budget_items_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_budget_items_on_user_id"
    t.check_constraint "type::text = ANY (ARRAY['fixed'::character varying, 'variable'::character varying]::text[])", name: "budget_items_type_check"
  end

  create_table "household_budgets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "income", null: false, comment: "収入"
    t.bigint "monthly_plan_id", null: false
    t.string "relationship", default: "me", null: false, comment: "続柄"
    t.datetime "updated_at", null: false
    t.index ["monthly_plan_id"], name: "index_household_budgets_on_monthly_plan_id"
    t.check_constraint "relationship::text = ANY (ARRAY['me'::character varying, 'spouse'::character varying, 'father'::character varying, 'mother'::character varying, 'child'::character varying, 'other'::character varying]::text[])", name: "household_budgets_relationship_check"
  end

  create_table "monthly_plan_details", force: :cascade do |t|
    t.integer "amount", default: 0, null: false, comment: "金額"
    t.bigint "budget_item_id", null: false
    t.datetime "created_at", null: false
    t.bigint "monthly_plan_id", null: false
    t.datetime "updated_at", null: false
    t.index ["budget_item_id"], name: "index_monthly_plan_details_on_budget_item_id"
    t.index ["monthly_plan_id", "budget_item_id"], name: "idx_on_monthly_plan_id_budget_item_id_4009ba7ee0", unique: true
    t.index ["monthly_plan_id"], name: "index_monthly_plan_details_on_monthly_plan_id"
    t.check_constraint "amount >= 0", name: "monthly_plan_details_amount_check"
  end

  create_table "monthly_plans", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description", comment: "説明文"
    t.string "title", null: false, comment: "月次予算計画のタイトル"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["title"], name: "index_monthly_plans_on_title", unique: true
    t.index ["user_id"], name: "index_monthly_plans_on_user_id"
  end

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

  add_foreign_key "budget_items", "users"
  add_foreign_key "household_budgets", "monthly_plans"
  add_foreign_key "monthly_plan_details", "budget_items"
  add_foreign_key "monthly_plan_details", "monthly_plans"
  add_foreign_key "monthly_plans", "users"
  add_foreign_key "profiles", "occupations"
  add_foreign_key "profiles", "prefectures"
  add_foreign_key "profiles", "users"
end
