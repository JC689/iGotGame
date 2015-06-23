class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.text :name
      t.text :release
      t.text :image
      t.text :description

      t.timestamps null: false
    end
  end
end
