class CondoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :address
  
  has_many :units
end
