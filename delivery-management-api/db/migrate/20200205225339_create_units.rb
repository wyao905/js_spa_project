class CreateUnits < ActiveRecord::Migration[6.0]
  def change
    create_table :units do |t|
      t.string :number
      t.string :tenant_name
      t.references :condo, null: false, foreign_key: true

      t.timestamps
    end
  end
end
