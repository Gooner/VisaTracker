class DateDimension < ActiveRecord::Base
    
    has_many :facts_submitted_on, foreign_key: :submitted_on_id, class_name: 'LaborCertificationFact'
    has_many :facts_decided_on, foreign_key: :decision_on_id, class_name: 'LaborCertificationFact'
end
