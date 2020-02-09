class CreateCondos < ActiveRecord::Migration[6.0]
  def change
    create_table :condos do |t|
      t.string :address

      t.timestamps
    end
  end
end
