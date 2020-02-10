class CondosController < ApplicationController
    def index
        condos = Condo.all
        options = {include: [:units]}
        render json: CondoSerializer.new(condos, options)
    end
    
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
