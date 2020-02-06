class PackagesController < ApplicationController
    def index
        packages = Package.all
        render json: PackageSerializer.new(packages).to_serialized_json
    end

    def show
        package = Package.find_by(id: params[:id])
        render json: PackageSerializer.new(package).to_serialized_json
    end
end
