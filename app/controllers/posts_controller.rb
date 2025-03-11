class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user
  before_action :set_post, only: %i[show update destroy]
 
  include Pagy::Backend

  #use json response for sending the data since react relies on api to fetch and receive data
  #to serialize object and send as a response / json
  #with pagy

  def index
    @posts = Post.all.order(created_at: :desc)
    render json: {
      #get posts and pages that sends to the react component
      #left will be the variable that use to access in react component
      #right the valus that will be passed
      posts: @posts.as_json(
        include: { user: { only: [:id, :first_name, :last_name] }, comments: {} },
        methods: [:coverimg_url]
      ),
      current_user: @user ? @user.as_json(only: [:id, :first_name, :last_name, :email]) : {}
    }
  end

  def userPost
    user = User.find_by(id: params[:id])
    if user
      posts = user.posts.order(created_at: :desc)
      render json: {
        posts: posts.as_json(
          include: { comments: {}, user: { only: [:id, :first_name, :last_name] } },
          methods: [:coverimg_url]
        ),
        user: user.as_json(only: [:id, :first_name, :last_name, :email, :bio, :birthday]),
        current_user: @user.as_json(only: [:id, :first_name, :last_name, :email])
      }
    else
      render json: { errors: "User not found" }, status: :not_found
    end
  end
  
  def show
    render json: {
      post: @post.as_json(
        include: { comments: { include: :user, order: 'created_at DESC'}, user: {} },
        methods: [:coverimg_url]
      ),
      current_user: @user || {}
    }
  end
  

  def create
    @post = Post.new(post_params)
    @post.user = current_user

    if @post.save
      render json: { post: @post, image_url: @post.coverimg.attached? ? url_for(@post.coverimg) : nil }, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if params[:post][:remove_coverimg] == "true"
      @post.coverimg.purge
    end
    if @post.update(post_params)
      render json: { post: @post, image_url: @post.coverimg.attached? ? url_for(@post.coverimg) : nil }, status: :ok
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

  def set_user
    @user = current_user
  
    unless @user
      render json: { error: "User not found" }, status: :not_found
    end
  end
  
  def post_params
    params.require(:post).permit(:title, :body, :description, :coverimg)
  end
end
