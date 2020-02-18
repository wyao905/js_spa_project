class UnitsController < ApplicationController
    def index
        units = Unit.all
        options = {include: [:condo, :packages]}
        render json: UnitSerializer.new(units, options)
    end

    def show
        unit = Unit.find_by(id: params[:id])
        options = {include: [:condo, :packages]}
        render json: UnitSerializer.new(unit, options)
    end

    def create
        condo = Condo.find_by(address: params[:address])
        unit = condo.units.build(number: params[:number], tenant_name: params[:tenantName])
        condo.save
        options = {include: [:condo, :packages]}
        render json: UnitSerializer.new(unit, options)
    end
end
