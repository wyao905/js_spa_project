class PackageSerializer
    def initialize(package_object)
        @package = package_object
    end

    def to_serialized_json
        @package.to_json(:include => {
            :unit => {:only => [
                :number,
                :message,
                :tenant_name
            ]}
        }, :except => [])
    end
end