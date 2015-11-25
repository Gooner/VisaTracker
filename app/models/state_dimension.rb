class StateDimension < ActiveRecord::Base
    
    validates :full_name, :short_name, presence: true
    
    has_many :facts_from_state, foreign_key: :work_state_id, class_name: 'LaborCertificationFact'
    
end
