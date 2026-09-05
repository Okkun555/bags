require 'rails_helper'

RSpec.describe "Api::BudgetItems", type: :request do
  let!(:user) { create(:user) }

  describe "#index" do
    subject { get "/api/budget_items" }

    context "ログイン済みの場合" do
      let!(:default_budget_items1) { create(:budget_item, user: nil, type: :fixed) }
      let!(:default_budget_items2) { create(:budget_item, user: nil, type: :variable) }
      let!(:custom_budget_items1) { create(:budget_item, user:, type: :fixed) }
      let!(:custom_budget_items2) { create(:budget_item, user:, type: :variable) }

      let(:other_user) { create(:user) }
      let!(:other_user_budget_items1) { create(:budget_item, user: other_user, type: :fixed) }
      let!(:other_user_budget_items2) { create(:budget_item, user: other_user, type: :variable) }

      before do
        login_as(user)
      end

      it "200とシステム標準 + ユーザーのカスタム予算項目一覧（固定費→変動費<default値が優先>）を返す" do
        subject
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq([
                                                      {
                                                        "id" => default_budget_items1.id,
                                                        "name" => default_budget_items1.name,
                                                        "type" => "fixed",
                                                        "operable" => false
                                                      },
                                                      {
                                                        "id" => custom_budget_items1.id,
                                                        "name" => custom_budget_items1.name,
                                                        "type" => "fixed",
                                                        "operable" => true
                                                      },
                                                      {
                                                        "id" => default_budget_items2.id,
                                                        "name" => default_budget_items2.name,
                                                        "type" => "variable",
                                                        "operable" => false
                                                      },
                                                      {
                                                        "id" => custom_budget_items2.id,
                                                        "name" => custom_budget_items2.name,
                                                        "type" => "variable",
                                                        "operable" => true
                                                      }
                                                    ])
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#create" do
    subject { post "/api/budget_items", params: }

    let(:params) do
      {
        budget_item: {
          name:,
          type:
        }
      }
    end
    let(:name) { "ペット費用" }
    let(:type) { "variable" }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメータが有効な場合" do
        it "カスタム予算項目を作成し、201と作成した予算項目を返す" do
          subject
          expect(response).to have_http_status(:created)

          budget_item = BudgetItem.find_by(name: name)
          expect(response.parsed_body).to eq({
                                                 "id" => budget_item&.id,
                                                 "name" => name,
                                                 "operable" => true,
                                                 "type" => type
                                               })
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#destroy" do
    subject { delete "/api/budget_items/#{budget_item.id}" }

    let(:budget_item) { create(:budget_item, user:) }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "デフォルト予算項目の場合" do
        let!(:budget_item) { create(:budget_item, user: nil) }

        it "データを削除せず、403を返す" do
          expect { subject }.not_to change(BudgetItem, :count)
          expect(response).to have_http_status(:forbidden)
        end
      end

      context "カスタム予算項目の場合" do
        let(:budget_item) { create(:budget_item, user: user) }

        it "カスタム予算項目を削除し、200を返す" do
          expect { subject }.to change(BudgetItem, :count).by(0)
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
