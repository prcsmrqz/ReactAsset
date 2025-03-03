class CommentsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_user

    def create
        @post = Post.find(params[:post_id])
        @comment = @post.comments.build(comment_params)
        @comment.user = current_user
        @comment.commenter = current_user.first_name + " " + current_user.last_name

        if @comment.save
            render json: @comment, status: :created
        else
            render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

    def destroy
        #destroy comment in show since it doesnt work with destroy method name
        @post = Post.find(params[:post_id])
        @comment = @post.comments.find(params[:id])
        
        @comment.destroy
        #returns 204 No Content with no body
        head :no_content
    end

    private
    def set_user
        @user = current_user
      
        unless @user
          render json: { error: "User not found" }, status: :not_found
        end
      end
      

    def comment_params
        params.require(:comment).permit(:body)
    end

end
