class RequestsController < ApplicationController
  before_action :authenticate_user!

  def create
    publisher = User.find_by(id: params[:publisher_id], role: 'publisher')
    return render json: { error: 'Publisher not found' }, status: :not_found unless publisher

    request = Request.new(
      advertiser: current_user,
      publisher: publisher,
      message: params[:message],
      budget: params[:budget]
    )
    if request.save
      render json: { request: request }, status: :created
    else
      render json: { error: request.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def index
    if current_user.role == 'publisher'
      requests = Request.where(publisher_id: current_user.id).includes(:advertiser).order(created_at: :desc)
      render json: {
        requests: requests.as_json(
          only: [:id, :message, :budget, :status, :created_at],
          include: { advertiser: { only: [:id, :name, :company_name, :email] } }
        )
      }
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def sent
    if current_user.role == 'advertiser'
      requests = Request.where(advertiser_id: current_user.id).includes(:publisher).order(created_at: :desc)
      render json: {
        requests: requests.as_json(
          only: [:id, :publisher_id, :status, :created_at, :budget, :message],
          include: { publisher: { only: [:id, :newsletter_name, :name, :email] } }
        )
      }
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def update
    request = Request.find_by(id: params[:id], publisher_id: current_user.id)
    return render json: { error: 'Request not found' }, status: :not_found unless request

    if params[:status].present? && %w[accepted rejected declined completed].include?(params[:status])
      request.status = params[:status] == 'declined' ? 'rejected' : params[:status]
      if request.save
        render json: { request: request }, status: :ok
      else
        render json: { error: request.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Invalid status' }, status: :unprocessable_entity
    end
  end
end 