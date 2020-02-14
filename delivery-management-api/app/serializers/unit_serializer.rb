class UnitSerializer
  include FastJsonapi::ObjectSerializer
  attributes :number, :tenant_name

  belongs_to :condo
  has_many :packages
end
