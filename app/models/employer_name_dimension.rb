class EmployerNameDimension < ActiveRecord::Base
    
    has_many :facts_from_employer, foreign_key: :employer_id, class_name: 'LaborCertificationFact'
    
end
