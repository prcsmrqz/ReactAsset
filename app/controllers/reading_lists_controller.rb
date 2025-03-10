class ReadingListsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user
  before_action :set_reading_list, only: [:destroy]

  def index
    @reading_list = current_user.reading_list
    puts @reading_list
    render json: @reading_list
  end

  def show
    
  end

  def create
    @readingList = ReadingList.new(reading_list_params)
    @readingList.user = current_user
    
    if @readingList.save
      puts @readingList.post_id
    puts @readingList.id
    puts @readingList.user_id
      render json: {reading_list: @readingList}, status: :created
    else
      render json: { errors: @readingList.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @reading_list.destroy
    head :no_content
  end

  private
  def set_user
    @user = current_user
  
    unless @user
      render json: { error: "User not found" }, status: :not_found
    end
  end

  def set_reading_list
    @reading_list = current_user.reading_list.find_by(id: params[:id])
    render json: { error: "Reading list item not found" }, status: :not_found unless @reading_list
  end

  def reading_list_params
    params.require(:reading_list).permit(:post_id)
  end
end
