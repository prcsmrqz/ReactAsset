class CommentsController < ApplicationController

    def create
        @post = Post.find(params[:post_id])
        @comment = @post.comments.build(comment_params)

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
    def comment_params
        params.require(:comment).permit(:commenter, :body)
    end

end
