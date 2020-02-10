class CondosController < ApplicationController
    def show
        condo = Condo.find(params[:id])
        options = {include: [:units]}
        render json: CondoSerializer.new(condo, options)
    end

    def create
        condo = Condo.create(address: params[:address])
        options = {include: [:units]}
        render json: CondoSerializer.new(condo, options)
    end
end
