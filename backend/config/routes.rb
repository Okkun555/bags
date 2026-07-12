Rails.application.routes.draw do
  namespace :api do
    resource :me, only: [:show], controller: :me

    post "signup", to: "auth#signup"
    post "login", to: "auth#login"
    post "logout", to: "auth#logout"
  end
end
