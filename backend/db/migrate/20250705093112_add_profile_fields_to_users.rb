class AddProfileFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :name, :string
    add_column :users, :website, :string
    add_column :users, :description, :text
    
    # Publisher-specific fields
    add_column :users, :newsletter_name, :string
    add_column :users, :subscriber_count, :string
    add_column :users, :category, :string
    add_column :users, :publishing_frequency, :string
    
    # Advertiser-specific fields
    add_column :users, :company_name, :string
    add_column :users, :industry, :string
    add_column :users, :target_audience, :string
    add_column :users, :budget, :string
  end
end
