Rails.application.routes.draw do
  devise_for :users,
           path: '',
           path_names: {
             sign_in: 'login',
             sign_out: 'logout',
             registration: 'signup'
           },
           controllers: {
             sessions: 'users/sessions',
             registrations: 'users/registrations'
           }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  patch 'users/role', to: 'users/roles#update'

  namespace :users do
    resource :profile, only: [:show, :update]
    resources :publishers, only: [:index]
  end

  post '/requests', to: 'requests#create'
  get '/requests', to: 'requests#index'
  get '/requests/sent', to: 'requests#sent'
  patch '/requests/:id', to: 'requests#update'

  # Defines the root path route ("/")
  # root "posts#index"
end
