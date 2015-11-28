require 'csv'

class StateImportJob < ActiveJob::Base
    queue_as :default

    def perform(url)
        
        state_dimensions = []
        ActiveRecord::Base.transaction do
            CSV.new(open(url), {:headers => true, :encoding => 'windows-1251:utf-8'}).each do |row|
                state_dimension = create_state_dimension(row)

                if state_dimension.valid?
                    puts state_dimension.lookup_field
                    StateDimension.delete_all(lookup_field: state_dimension.lookup_field)
                    state_dimensions << state_dimension
                end
            end

            StateDimension.import state_dimensions
        end
        
        TempFileDeleteJob.perform_later(url)
    end

    private

    def create_state_dimension(row)

        state_dimension = StateDimension.new do | st |
            st.full_name = row["State"].strip
            st.lookup_field = row["State"].gsub(/\W/,'').upcase
            st.short_name = row["PostalAbbreviation"].strip
        end

        return state_dimension
    end

    def add_state_dimension(state_dimension)

        ActiveRecord::Base.transaction do
            puts state_dimension.lookup_field

            StateDimension.delete_all(lookup_field: state_dimension.lookup_field)

            state_dimension.save
        end

    end
end
