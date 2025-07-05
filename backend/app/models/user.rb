class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  validates :role, inclusion: { in: ["publisher", "advertiser", nil], message: "%{value} is not a valid role" }
  
  # Profile validations
  validates :name, presence: true, if: :profile_complete?
  validates :description, presence: true, if: :profile_complete?
  
  # Publisher-specific validations
  validates :newsletter_name, presence: true, if: :publisher_profile_complete?
  validates :subscriber_count, presence: true, if: :publisher_profile_complete?
  validates :category, presence: true, if: :publisher_profile_complete?
  validates :publishing_frequency, presence: true, if: :publisher_profile_complete?
  
  # Advertiser-specific validations
  validates :company_name, presence: true, if: :advertiser_profile_complete?
  validates :industry, presence: true, if: :advertiser_profile_complete?
  validates :target_audience, presence: true, if: :advertiser_profile_complete?
  validates :budget, presence: true, if: :advertiser_profile_complete?
  
  private
  
  def profile_complete?
    name.present? && description.present?
  end
  
  def publisher_profile_complete?
    role == "publisher" && newsletter_name.present? && subscriber_count.present? && 
    category.present? && publishing_frequency.present?
  end
  
  def advertiser_profile_complete?
    role == "advertiser" && company_name.present? && industry.present? && 
    target_audience.present? && budget.present?
  end
end
