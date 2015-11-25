class JobTitleDimension < ActiveRecord::Base
    
    has_many :facts_with_job_title, foreign_key: :job_title_id, class_name: 'LaborCertificationFact'
    
end
