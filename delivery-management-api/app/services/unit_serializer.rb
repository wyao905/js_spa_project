class UnitSerializer
    def initialize(unit_object)
        @unit = unit_object
    end

    def to_serialized_json
        @unit.to_json(:except => [:created_at, :update_at])
    end
end