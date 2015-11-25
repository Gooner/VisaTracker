class CreateStateDimensions < ActiveRecord::Migration
    def change
        create_table :state_dimensions do |t|
            t.string :full_name, null: false
            t.string :short_name, null: false
            t.string :lookup_field, null: false, index: true, unique: true

            t.timestamps null: false
        end
    end
end
