class CreateEmployerNameDimensions < ActiveRecord::Migration
    def change
        create_table :employer_name_dimensions do |t|
            t.string :employer_name, null: false
            t.string :lookup_field, null: false, index: true, unique: true
            t.string :employer_address
            t.string :employer_city
            t.string :employer_state
            t.string :employer_country
            t.string :employer_postal_code

            t.timestamps null: false
        end
    end
end
