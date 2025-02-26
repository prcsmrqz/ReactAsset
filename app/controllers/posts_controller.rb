class PostsController < ApplicationController
  before_action :set_post, only: %i[show update destroy]
  include Pagy::Backend

  #use json response for sending the data since react relies on api to fetch and receive data
  #to serialize object and send as a response / json
  def index
    @pagy, @posts = pagy(Post.all.order(created_at: :desc), items: 5) # Set items per page
    render json: {
      #get posts and pages that sends to the react component
      #left will be the variable that use to access in react component
      #right the valus that will be passed
      posts: @posts,
      page: @pagy.page,
      pages: @pagy.pages,
      next: @pagy.next ? @pagy.next : nil,
      prev: @pagy.prev ? @pagy.prev : nil
    }
  end
  
  def show
    render json: @post, include: :comments
  end

  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    #returns 204 No Content with no body
    head :no_content
  end

  private

  def set_post
    @post = Post.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Post not found" }, status: :not_found
  end

  def post_params
    params.require(:post).permit(:title, :body)
  end
end
