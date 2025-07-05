class Request < ApplicationRecord
  belongs_to :advertiser, class_name: 'User'
  belongs_to :publisher, class_name: 'User'

  validates :message, presence: true
  validates :advertiser_id, presence: true
  validates :publisher_id, presence: true
  validates :status, inclusion: { in: %w[pending accepted rejected completed] }
  validates :budget, presence: true, on: :create
end 