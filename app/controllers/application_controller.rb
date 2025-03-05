class ApplicationController < ActionController::Base
  #csrf protection to raise an exception when a request is suspected to be forged
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?

  after_action :set_csrf_token_header

  private

  def set_csrf_token_header
    #retrieves csrf token using form_authenticity_token and set it as a header
    #this is useful for login and logout since it needs a new csrf token
    response.set_header('X-CSRF-Token', form_authenticity_token)
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :first_name, :last_name, :bio, :birthday])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end
end
