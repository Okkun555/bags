Rails.application.routes.draw do
  namespace :api do
    resource :me, only: [ :show ], controller: :me

    # マスターデータ
    resources :occupations, only: [ :index ]
    resources :prefectures, only: [ :index ]

    resources :profiles, only: [ :create ]
    resources :budget_items
    resources :monthly_plans do
      scope module: :monthly_plans do
        resource :household_budgets, only: [:update]
        resource :monthly_plan_details, only: [:update]
      end
    end

    post "signup", to: "auth#signup"
    post "login", to: "auth#login"
    post "logout", to: "auth#logout"
  end
end
