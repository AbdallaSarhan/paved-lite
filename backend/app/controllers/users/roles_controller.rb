class Users::RolesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def update
    if params[:role].present? && ["publisher", "advertiser"].include?(params[:role])
      current_user.update(role: params[:role])
      render json: { user: { id: current_user.id, email: current_user.email, role: current_user.role } }, status: :ok
    else
      render json: { error: "Invalid role. Must be 'publisher' or 'advertiser'." }, status: :unprocessable_entity
    end
  end
end 