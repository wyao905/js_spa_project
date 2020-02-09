class CondosController < ApplicationController
    def show
        condo = Condo.find(params[:id])
        options = {include: [:units]}
        render json: CondoSerializer.new(condo, options)
    end
end
