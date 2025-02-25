Rails.application.routes.draw do
  resources :posts do
    resources :comments
  end
  root to: "home#index"
  get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
