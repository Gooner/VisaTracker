class CreateLaborCertificationFacts < ActiveRecord::Migration
    def change
        create_table :labor_certification_facts do |t|
            t.integer :count_of_cases, null: false

            t.integer :work_state_id, null: false
            t.integer :submitted_on_id, null: false
            t.integer :decision_on_id, null: false, index: true
            t.integer :case_status_id, null: false
            t.integer :employer_id, null: false
            t.integer :job_title_id, null: false

            t.timestamps null: false
        end

        add_foreign_key :labor_certification_facts, :state_dimensions, column: :work_state_id, on_delete: :cascade
        add_foreign_key :labor_certification_facts, :date_dimensions, column: :submitted_on_id, on_delete: :cascade
        add_foreign_key :labor_certification_facts, :date_dimensions, column: :decision_on_id, on_delete: :cascade
        add_foreign_key :labor_certification_facts, :case_status_dimensions, column: :case_status_id, on_delete: :cascade
        add_foreign_key :labor_certification_facts, :employer_name_dimensions, column: :employer_id, on_delete: :cascade
        add_foreign_key :labor_certification_facts, :job_title_dimensions, column: :job_title_id, on_delete: :cascade
    end
end
