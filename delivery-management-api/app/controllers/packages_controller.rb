class PackagesController < ApplicationController
    def index
        packages = Package.all
        options = {include: [:unit]}
        render json: PackageSerializer.new(packages, options)
    end

    def show
        package = Package.find_by(id: params[:id])
        options = {include: [:unit]}
        render json: PackageSerializer.new(packages, options)
    end
end
