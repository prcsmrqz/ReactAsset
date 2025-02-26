class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
before_action :configure_permitted_parameters, if: :devise_controller?

  
  after_action :set_csrf_token_header

  private

  def set_csrf_token_header
    response.set_header('X-CSRF-Token', form_authenticity_token)
  end
  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end
end
