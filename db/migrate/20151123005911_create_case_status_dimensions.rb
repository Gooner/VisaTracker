class CreateCaseStatusDimensions < ActiveRecord::Migration
    def change
        create_table :case_status_dimensions do |t|
            t.string :case_status, null: false
            t.string :lookup_field, null: false, index: true, unique: true

            t.timestamps null: false
        end
    end
end
