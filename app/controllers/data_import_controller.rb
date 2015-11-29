class DataImportController < ApplicationController
    @importType = 'labor'

    def index
        @importType = params[:importType]

        respond_to do |format|
            format.html { render :layout => false }
        end
    end

    def labor_data
        uploaded_io = params[:data_file]

        job = LaborCertImportJob.perform_later(uploaded_io.tempfile.path)
        status = { job_id: job.job_id }
        
        respond_to do |format|
            format.xml  { render xml: status }
            format.json { render json: status }
        end 
    end

    def state_data
        uploaded_io = params[:data_file]

        job = StateImportJob.perform_later(uploaded_io.tempfile.path)
        status = { job_id: job.job_id }
        
        respond_to do |format|
            format.xml  { render xml: status }
            format.json { render json: status }
        end 
    end

    def import_status
        job_id = params[:jobId]
        status = Rails.cache.fetch(job_id)
        
        respond_to do |format|
            format.xml  { render xml: status }
            format.json { render json: status }
        end 
    end
    
end