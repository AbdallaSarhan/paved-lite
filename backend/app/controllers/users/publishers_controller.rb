class Users::PublishersController < ApplicationController
  before_action :authenticate_user!

  def index
    publishers = User.where(role: 'publisher')
    render json: {
      publishers: publishers.as_json(only: [
        :id, :email, :name, :website, :description,
        :newsletter_name, :subscriber_count, :category, :publishing_frequency
      ])
    }
  end
end 