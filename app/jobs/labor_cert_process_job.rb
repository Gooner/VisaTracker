class LaborCertProcessJob < ActiveJob::Base
    queue_as :default

    def perform(updated_after)

        get_uniq_decision_date(updated_after).each do |record|
            puts record.decision_date

            fact_records = calc_labor_cert_fact_data(record.decision_date)
            puts fact_records.count

            ActiveRecord::Base.transaction do

                delete_labor_cert_facts(record.decision_date)

                import_labor_cert_facts(fact_records)
            end
        end
    end

    private

    def get_uniq_decision_date(updated_after)

        if updated_after.nil?
            return LaborCertification.
                select(:decision_date).
                uniq()
        else
            return LaborCertification.
                where(updated_at: updated_after..Time.now).
                select(:decision_date).
                uniq()
        end
    end

    def calc_labor_cert_fact_data(decision_date)
        return LaborCertification.
            where(decision_date: decision_date).
            select('labor_certifications.*, COUNT(*) as case_count').
            group(:decision_date, :case_submitted, :case_status, :employer_name, :work_state, :job_title).
            to_a
    end

    def delete_labor_cert_facts(decision_date)

        date_dimension = DateDimension.find_by(date_value: decision_date)

        unless date_dimension.nil?
            LaborCertificationFact.delete_all(decision_on: date_dimension)
        end
    end

    def import_labor_cert_facts(fact_records)
        labor_cert_facts = []

        unless fact_records.nil?

            fact_records.each do |record|
                labor_cert_facts << create_labor_cert_fact(record)                
            end

            LaborCertificationFact.import labor_cert_facts
        end
    end

    def create_labor_cert_fact(record)
        work_state = get_state_dimension(record.work_state)
        submitted_on = create_date_dimension(record.case_submitted)
        decision_on = create_date_dimension(record.decision_date)
        case_status = create_case_status_dimension(record.case_status)
        employer = create_employer_name_dimension(record.employer_name, record.employer_address, record.employer_city, record.employer_state, record.employer_country, record.employer_postal_code)
        job_title = create_job_title_dimension(record.job_title)
        
        labor_cert_fact = LaborCertificationFact.new do |lct|
            lct.work_state_id = work_state.id
            lct.submitted_on_id = submitted_on.id
            lct.decision_on_id = decision_on.id
            lct.case_status_id = case_status.id
            lct.employer_id = employer.id
            lct.job_title_id = job_title.id
            lct.count_of_cases = record.case_count
        end

        return labor_cert_fact
    end

    def create_date_dimension(date_value)
        date_dimension = DateDimension.find_by(date_value: date_value)

        unless date_dimension.nil?
            return date_dimension            
        end

        date_dimension = DateDimension.new do |dd|
            dd.year_value = date_value.year
            dd.month_value = date_value.month
            dd.day_value = date_value.day
            dd.date_value = date_value            
        end

        date_dimension.save
        return date_dimension
    end

    def create_case_status_dimension(case_status)
        case_status_dimension = CaseStatusDimension.find_by(lookup_field: case_status.gsub(/\W/,'').upcase)

        unless case_status_dimension.nil?
            return case_status_dimension            
        end

        case_status_dimension = CaseStatusDimension.new do |csd|
            csd.case_status = case_status           
            csd.lookup_field = case_status.gsub(/\W/,'').upcase          
        end

        case_status_dimension.save
        return case_status_dimension
    end

    def create_employer_name_dimension(employer_name, employer_address, employer_city, employer_state, employer_country, employer_postal_code)
        employer_name_dimension = EmployerNameDimension.find_by(lookup_field: employer_name.gsub(/\W/,'').upcase)

        unless employer_name_dimension.nil?
            return employer_name_dimension            
        end

        employer_name_dimension = EmployerNameDimension.new do |enamed|
            enamed.employer_name = employer_name           
            enamed.lookup_field = employer_name.gsub(/\W/,'').upcase           
            enamed.employer_address = employer_address           
            enamed.employer_city = employer_city           
            enamed.employer_state = employer_state           
            enamed.employer_country = employer_country           
            enamed.employer_postal_code = employer_postal_code           
        end

        employer_name_dimension.save
        return employer_name_dimension
    end

    def create_job_title_dimension(job_title)
        job_title_dimension = JobTitleDimension.find_by(lookup_field: job_title.gsub(/\W/,'').upcase)

        unless job_title_dimension.nil?
            return job_title_dimension            
        end

        job_title_dimension = JobTitleDimension.new do |jtd|
            jtd.job_title = job_title           
            jtd.lookup_field = job_title.gsub(/\W/,'').upcase          
        end

        job_title_dimension.save
        return job_title_dimension
    end

    def get_state_dimension(full_name)        
        state_dimension = StateDimension.find_by(lookup_field: full_name.gsub(/\W/,'').upcase)
        return state_dimension
    end
end
