class PackageSerializer
  include FastJsonapi::ObjectSerializer
  attributes :address, :courier, :created_at, :claimed

  belongs_to :unit
end
