class Users::SessionsController < Devise::SessionsController
  respond_to :json
  

  def check_auth
    if current_user
      render json: { logged_in: true, user: current_user.as_json(only: [:id, :email]) }
    else
      render json: { logged_in: false }
    end
  end
  
  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: "Logged in successfully." },
      data: resource.as_json(only: [:id, :email])
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: { status: 200, message: "Logged out successfully" }, status: :ok
    else
      head :no_content
    end
  end
  
end
