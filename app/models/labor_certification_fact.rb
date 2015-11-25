class LaborCertificationFact < ActiveRecord::Base

    belongs_to :work_state, :class_name => 'StateDimension'
    belongs_to :submitted_on, :class_name => 'DateDimension'
    belongs_to :decision_on, :class_name => 'DateDimension'
    belongs_to :case_status, :class_name => 'CaseStatusDimension'
    belongs_to :employer, :class_name => 'EmployerNameDimension'
    belongs_to :job_title, :class_name => 'JobTitleDimension'

end
