class Api::BudgetItemsController < ApplicationController
  def index
    budget_items = BudgetItem.available_items(user: current_user)

    render json: BudgetItemSerializer.render_as_json(budget_items), status: :ok
  end
end
