class Users::ProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: {
      user: current_user.as_json(only: [
        :id, :email, :role, :name, :website, :description,
        :newsletter_name, :subscriber_count, :category, :publishing_frequency,
        :company_name, :industry, :target_audience, :budget
      ])
    }
  end

  def update
    if current_user.update(profile_params)
      render json: {
        user: current_user.as_json(only: [
          :id, :email, :role, :name, :website, :description,
          :newsletter_name, :subscriber_count, :category, :publishing_frequency,
          :company_name, :industry, :target_audience, :budget
        ])
      }
    else
      render json: { error: current_user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:profile).permit(
      :name, :website, :description,
      :newsletter_name, :subscriber_count, :category, :publishing_frequency,
      :company_name, :industry, :target_audience, :budget
    )
  end
end 