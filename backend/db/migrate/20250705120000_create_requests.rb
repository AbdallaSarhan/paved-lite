class CreateRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :requests do |t|
      t.references :advertiser, null: false, foreign_key: { to_table: :users }
      t.references :publisher, null: false, foreign_key: { to_table: :users }
      t.text :message
      t.string :budget
      t.string :status, default: "pending"
      t.timestamps
    end
  end
end 