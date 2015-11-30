require 'csv'

class StateImportJob < ActiveJob::Base
    queue_as :default

    def perform(url)
        begin
            logger.debug "Starting state data import job. File: #{url}"

            ActiveRecord::Base.transaction do

                state_dimensions = parse_state_dimensions(url)
                logger.debug "Parsed state data. Found #{state_dimensions.count} states."

                StateDimension.import state_dimensions
            end

        rescue => error
            logger.fatal "State data import job failed. Error Type: #{error.class}, Message: #{error.message}."
        end

        logger.debug "Finished state data import job. Calling temp file delete job."
        TempFileDeleteJob.perform_later(url)
    end

    private

    def parse_state_dimensions(url)
        state_dimensions = []
        logger.debug "Parsing the state data file"
        CSV.new(open(url), {:headers => true, :encoding => 'windows-1251:utf-8'}).each do |row|
            state_dimension = create_state_dimension(row)

            if state_dimension.valid?
                logger.debug "Found state #{state_dimension.lookup_field} and deleting if exists."
                StateDimension.delete_all(lookup_field: state_dimension.lookup_field)
                state_dimensions << state_dimension
            end
        end

        return state_dimensions
    end

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
