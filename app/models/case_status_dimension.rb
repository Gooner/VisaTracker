class CaseStatusDimension < ActiveRecord::Base
    
    has_many :facts_with_case_status, foreign_key: :case_status_id, class_name: 'LaborCertificationFact'
    
end
