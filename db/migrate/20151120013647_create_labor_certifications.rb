class CreateLaborCertifications < ActiveRecord::Migration
    def change
        create_table :labor_certifications do |t|
            
            t.string :case_number, null: false, index: true, unique: true
            t.date :case_submitted, null: false
            t.string :case_status, null: false
            t.date :decision_date, null: false, index: true
            
            t.string :employer_name, null: false
            t.string :employer_address
            t.string :employer_city
            t.string :employer_state
            t.string :employer_country
            t.string :employer_postal_code
            
            t.decimal :prevailing_wage
            t.string :prevailing_unit
            t.decimal :wage_offered
            t.string :wage_offered_unit
            
            t.string :job_title, null: false
            t.string :work_city
            t.string :work_state, null: false
            t.string :work_postal_code
            t.string :education
            
            t.string :country_of_citizenship
            t.string :class_of_admission
            
            t.timestamps null: false
        end
    end
end
