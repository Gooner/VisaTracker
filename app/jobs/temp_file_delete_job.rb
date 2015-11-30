class TempFileDeleteJob < ActiveJob::Base
    queue_as :default

    def perform(file_to_delete)
        begin
            logger.debug "Starting job to delete temporary file #{file_to_delete}."

            if File.exist?(file_to_delete)
                FileUtils.rm_r file_to_delete, :force => true
            end
            
            logger.debug "Completed job and deleted temporary file #{file_to_delete}."
        rescue => error
            logger.fatal "Temporary file delete job failed. Error Type: #{error.class}, Message: #{error.message}."
        end
    end
end
