class CreatePackages < ActiveRecord::Migration[6.0]
  def change
    create_table :packages do |t|
      t.string :address
      t.string :courier
      t.boolean :claimed, default: false
      t.references :unit, null: false, foreign_key: true

      t.timestamps
    end
  end
end
