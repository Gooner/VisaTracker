class LaborCertificationController < ApplicationController

    def by_case_submitted_on_date
        decided_on = Date.parse(params[:decided_on])

        data = DateDimension.
            joins(facts_decided_on: :submitted_on).
            where(date_value: decided_on).
            select('submitted_ons_labor_certification_facts.date_value as submitted_date, sum(labor_certification_facts.count_of_cases) as count_of_cases').
            group('submitted_ons_labor_certification_facts.date_value')
        
        respond_to do |format|
            format.xml  { render xml: data}
            format.json { render json: data}
        end
    end

end
