class CreateDateDimensions < ActiveRecord::Migration
    def change
        create_table :date_dimensions do |t|
            t.integer :year_value, null: false
            t.integer :month_value, null: false
            t.integer :day_value, null: false
            t.date :date_value, null: false, index: true, unique: true

            t.timestamps null: false
        end
    end
end
