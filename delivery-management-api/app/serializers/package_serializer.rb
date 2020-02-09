class PackageSerializer
  include FastJsonapi::ObjectSerializer
  attributes :address, :courier, :created_at

  belongs_to :unit
end
