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

    def create
        unit = Unit.find_by(number: params[:unit])
        if !unit
            condo = Condo.find_by(address: params[:address])
            unit = condo.units.build(number: params[:unit])
            condo.save
        end
        package = unit.packages.build(address: params[:address], courier: params[:courier])
        unit.save

        options = {include: [:unit]}
        render json: PackageSerializer.new(package, options)
    end

    def update
        package = Package.find_by(id: params[:id])
        package.update(claimed: params[:claimed])
        render json: PackageSerializer.new(package)
    end
end
