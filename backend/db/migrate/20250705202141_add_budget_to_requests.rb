class AddBudgetToRequests < ActiveRecord::Migration[8.0]
  def change
    add_column :requests, :budget, :string
  end
end
