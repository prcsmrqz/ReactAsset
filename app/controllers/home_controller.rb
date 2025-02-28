class HomeController < ApplicationController
  def index
  end

  def show
    render json: current_user if user_signed_in?
  end

end
