class UnitSerializer
  include FastJsonapi::ObjectSerializer
  attributes :number, :message, :tenant_name

  belongs_to :condo
  has_many :packages
end
