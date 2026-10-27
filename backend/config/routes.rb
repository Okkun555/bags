Rails.application.routes.draw do
  namespace :api do
    resource :me, only: [ :show ], controller: :me

    # マスターデータ
    resources :occupations, only: [ :index ]
    resources :prefectures, only: [ :index ]

    resources :profiles, only: [ :create ]

    # 予算管理
    resources :budget_items
    resources :monthly_plans do
      scope module: :monthly_plans do
        resource :household_budgets, only: [:update]
        resource :monthly_plan_details, only: [:update]
      end
    end

    # 資産管理
    resources :asset_accounts

    post "signup", to: "auth#signup"
    post "login", to: "auth#login"
    post "logout", to: "auth#logout"
  end
end
