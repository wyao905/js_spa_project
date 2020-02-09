class CondosController < ApplicationController
    def show
        condo = Condo.find(params[:id])
        render json: CondoSerializer.new(sighting)
    end
end
