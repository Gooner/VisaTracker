class CreateJobTitleDimensions < ActiveRecord::Migration
    def change
        create_table :job_title_dimensions do |t|
            t.string :job_title
            t.string :lookup_field, null: false, index: true, unique: true

            t.timestamps null: false
        end
    end
end
