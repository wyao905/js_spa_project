class CreatePackages < ActiveRecord::Migration[6.0]
  def change
    create_table :packages do |t|
      t.string :address
      t.string :date
      t.string :courier

      t.timestamps
    end
  end
end
