class LaborCertification < ActiveRecord::Base
    
    validates :case_number, :case_submitted, :case_status, :decision_date, :employer_name, :work_state, :job_title, :country_of_citizenship, presence: true
    
end
