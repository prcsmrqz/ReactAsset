class PostsController < ApplicationController
  before_action :set_post, only: %i[show update destroy]
  include Pagy::Backend

  # GET /posts
  def index
    @pagy, @posts = pagy(Post.all, items: 10) # Set items per page
    render json: {
      data: @posts,
      page: @pagy.page,
      pages: @pagy.pages,
      next: @pagy.next ? @pagy.next : nil,
      prev: @pagy.prev ? @pagy.prev : nil
    }
  end
  
  
  
  # GET /posts/:id
  def show
    render json: @post
  end

  # POST /posts
  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /posts/:id
  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /posts/:id
  def destroy
    @post.destroy
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
