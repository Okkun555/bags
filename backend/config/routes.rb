Rails.application.routes.draw do
  namespace :api do
    resource :me, only: [ :show ], controller: :me

    # マスターデータ
    resources :occupations, only: [ :index ]
    resources :prefectures, only: [ :index ]

    resources :profiles, only: [ :create ]
    resources :budget_items

    post "signup", to: "auth#signup"
    post "login", to: "auth#login"
    post "logout", to: "auth#logout"
  end
end
