# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

condo = Condo.create(address: "123 Fourth Street")

unit_007 = Unit.create(number: "007", tenant_name: "James", condo: condo)
unit_115 = Unit.create(number: "115", tenant_name: "Tony", condo: condo)

package_1 = Package.create(
    address: "123 Fourth Street, Unit 007",
    courier: "Fedex",
    unit: unit_007
)
package_2 = Package.create(
    address: "123 Fourth Street, Unit 115",
    courier: "Amazon",
    unit: unit_115
)
package_3 = Package.create(
    address: "122 Fourth Street, Unit 007",
    courier: "Amazon",
    unit: unit_007
)
package_4 = Package.create(
    address: "123 Fourth Street, Unit 007",
    courier: "Fedex",
    unit: unit_007
)