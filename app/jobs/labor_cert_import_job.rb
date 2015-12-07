require 'csv'

class LaborCertImportJob < ActiveJob::Base
    queue_as :default

    def perform(url)
        begin
            logger.info "Starting loabor data import job. File: #{url}"
            started_at = Date.today

            import_labor_cases(url)
            logger.debug "Imported labor cases. Starting job to process imported cases after #{started_at}."

            LaborCertProcessJob.perform_later(started_at.to_s)

        rescue => error
            logger.fatal "Labor data import job failed. Error Type: #{error.class}, Message: #{error.message}."
        end

        logger.info "Finished labor data import job. Calling temp file delete job."
        TempFileDeleteJob.perform_later(url)
    end

    private

    def import_labor_cases(url)
        
        logger.debug "Parsing the labor data file"
        CSV.new(open(url, 'rt:windows-1252:utf-8'), {:headers => true, :encoding => 'windows-1252:utf-8'}).each do |row|
            labor_case = create_labor_certificate(row)

            if labor_case.valid?
                logger.debug "Found valid labor case with case #{labor_case.case_number}."
                delete_insert_labor_case(labor_case)
            end

            delete_insert_labor_cases(labor_cases)
        end
    end

    def delete_insert_labor_case(labor_case)
        ActiveRecord::Base.transaction do
            logger.debug "Deleting existing labor cases with case number #{labor_case.case_number}."
            LaborCertification.delete_all(:case_number => labor_case)

            logger.debug "Importing new labor case with case number #{labor_case.case_number}."
            labor_case.save
        end
    end

    def create_labor_certificate(row)

        case_time = DateTime.strptime(row['CASE_NUMBER'].split("-")[1], '%y%j')

        labor_case = LaborCertification.new do |lcd|
            lcd.case_number = row['CASE_NUMBER']
            lcd.case_submitted = case_time
            lcd.case_status = row['CASE_STATUS']
            lcd.decision_date = DateTime.strptime(row['DECISION_DATE'], '%m/%d/%Y')

            lcd.employer_name = row['EMPLOYER_NAME']
            lcd.employer_address = row['EMPLOYER_ADDRESS']
            lcd.employer_city = row['EMPLOYER_CITY']
            lcd.employer_state = row['EMPLOYER_STATE']
            lcd.employer_country = row['EMPLOYER_COUNTRY']
            lcd.employer_postal_code = row['EMPLOYER_POSTAL_CODE']

            lcd.prevailing_wage = row['PREVAILING_WAGE']
            lcd.prevailing_unit = row['PREVAILING_UNIT']
            lcd.wage_offered = row['WAGE_OFFERED']
            lcd.wage_offered_unit = row['WAGE_OFFERED_UNIT']

            lcd.job_title = row['JOB_TITLE']
            lcd.work_city = row['WORK_CITY']
            lcd.work_state = row['WORK_STATE']
            lcd.work_postal_code = row['WORK_POSTAL_CODE']
            lcd.education = row['EDUCATION']

            lcd.country_of_citizenship = row['COUNTRY_OF_CITIZENSHIP']
            lcd.class_of_admission = row['CLASS_OF_ADMISSION']
        end

        return labor_case
    end
end
