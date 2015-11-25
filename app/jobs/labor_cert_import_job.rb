require 'csv'

class LaborCertImportJob < ActiveJob::Base
    queue_as :default

    def perform(file)
        puts file

        laborCases = []
        ActiveRecord::Base.transaction do
            CSV.foreach(file, {:headers => true, :encoding => 'windows-1251:utf-8'}).each do |row|
                laborCase = create_labor_certificate(row)

                if laborCase.valid?
                    puts laborCase.case_number

                    LaborCertification.delete_all(case_number: laborCase.case_number)

                    laborCases << laborCase
                end
            end
            
            LaborCertification.import laborCases
        end
    end

    private

    def create_labor_certificate(row)

        case_time = DateTime.strptime(row['CASE_NUMBER'].split("-")[1], '%y%j')

        laborCase = LaborCertification.new do |lcd|
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

        return laborCase
    end
end
