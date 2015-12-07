require 'csv'

class StateImportJob < ActiveJob::Base
    queue_as :default

    def perform(url)
        begin
            logger.info "Starting state data import job. Env: #{ENV['RAILS_ENV']}. File: #{url}"
            import_state_data(url)
        rescue => error
            logger.fatal "State data import job failed. Error Type: #{error.class}, Message: #{error.message}."
        end

        logger.info "Finished state data import job. Calling temp file delete job."
        TempFileDeleteJob.perform_later(url)
    end

    private

    def import_state_data(url)

        logger.debug "Parsing the state data file"
        CSV.new(open(url, 'rt:windows-1252:utf-8'), {:headers => true, :encoding => 'windows-1252:utf-8'}).each do |row|
            state_dimension = create_state_dimension(row)

            if state_dimension.valid?
                delete_insert_state(state_dimension)
            end
        end
    end

    def delete_insert_state(state_dimension)
        ActiveRecord::Base.transaction do
            logger.debug "Found state #{state_dimension.lookup_field} and deleting if exists."
            StateDimension.delete_all(lookup_field: state_dimension.lookup_field)
            
            logger.debug "Importing new state #{state_dimension.lookup_field}."
            state_dimension.save
        end
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
