class CreateUnits < ActiveRecord::Migration[6.0]
  def change
    create_table :units do |t|
      t.string :number
      t.string :message

      t.timestamps
    end
  end
end
