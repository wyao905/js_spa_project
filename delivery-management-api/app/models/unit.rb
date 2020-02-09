class Unit < ApplicationRecord
    belongs_to :condo
    has_many :packages
end
