# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151123013645) do

  create_table "case_status_dimensions", force: :cascade do |t|
    t.string   "case_status",  null: false
    t.string   "lookup_field", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "case_status_dimensions", ["lookup_field"], name: "index_case_status_dimensions_on_lookup_field"

  create_table "date_dimensions", force: :cascade do |t|
    t.integer  "year_value",  null: false
    t.integer  "month_value", null: false
    t.integer  "day_value",   null: false
    t.date     "date_value",  null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "date_dimensions", ["date_value"], name: "index_date_dimensions_on_date_value"

  create_table "employer_name_dimensions", force: :cascade do |t|
    t.string   "employer_name",        null: false
    t.string   "lookup_field",         null: false
    t.string   "employer_address"
    t.string   "employer_city"
    t.string   "employer_state"
    t.string   "employer_country"
    t.string   "employer_postal_code"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "employer_name_dimensions", ["lookup_field"], name: "index_employer_name_dimensions_on_lookup_field"

  create_table "job_title_dimensions", force: :cascade do |t|
    t.string   "job_title"
    t.string   "lookup_field", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "job_title_dimensions", ["lookup_field"], name: "index_job_title_dimensions_on_lookup_field"

  create_table "labor_certification_facts", force: :cascade do |t|
    t.integer  "count_of_cases",  null: false
    t.integer  "work_state_id",   null: false
    t.integer  "submitted_on_id", null: false
    t.integer  "decision_on_id",  null: false
    t.integer  "case_status_id",  null: false
    t.integer  "employer_id",     null: false
    t.integer  "job_title_id",    null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "labor_certification_facts", ["decision_on_id"], name: "index_labor_certification_facts_on_decision_on_id"

  create_table "labor_certifications", force: :cascade do |t|
    t.string   "case_number",            null: false
    t.date     "case_submitted",         null: false
    t.string   "case_status",            null: false
    t.date     "decision_date",          null: false
    t.string   "employer_name",          null: false
    t.string   "employer_address"
    t.string   "employer_city"
    t.string   "employer_state"
    t.string   "employer_country"
    t.string   "employer_postal_code"
    t.decimal  "prevailing_wage"
    t.string   "prevailing_unit"
    t.decimal  "wage_offered"
    t.string   "wage_offered_unit"
    t.string   "job_title",              null: false
    t.string   "work_city"
    t.string   "work_state",             null: false
    t.string   "work_postal_code"
    t.string   "education"
    t.string   "country_of_citizenship"
    t.string   "class_of_admission"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "labor_certifications", ["decision_date"], name: "index_labor_certifications_on_decision_date"

  create_table "state_dimensions", force: :cascade do |t|
    t.string   "full_name",    null: false
    t.string   "short_name",   null: false
    t.string   "lookup_field", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "state_dimensions", ["lookup_field"], name: "index_state_dimensions_on_lookup_field"

end
