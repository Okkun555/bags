class Api::BudgetItemsController < ApplicationController
  def index
    budget_items = BudgetItem.available_items(user: current_user)

    render json: BudgetItemSerializer.render_as_json(budget_items), status: :ok
  end

  def create
    budget_item = current_user.budget_items.build(budget_items_params)
    authorize budget_item

    if budget_item.save!
      render json: BudgetItemSerializer.render_as_json(budget_item), status: :created
    end
  end

  private

  def budget_items_params
    params.expect(budget_item: [ :name, :type ])
  end
end
