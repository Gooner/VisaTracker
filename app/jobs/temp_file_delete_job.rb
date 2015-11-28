class TempFileDeleteJob < ActiveJob::Base
    queue_as :default

    def perform(file_to_delete)
        puts file_to_delete
        
        if File.exist?(file_to_delete)
            FileUtils.rm_r file_to_delete, :force => true
        end
    end
end
