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
end
