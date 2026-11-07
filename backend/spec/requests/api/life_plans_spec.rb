require 'rails_helper'

RSpec.describe "Api::LifePlans", type: :request do
  let(:user) { create(:user) }

  describe "#index" do
    subject { get "/api/life_plans" }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "ライフプランが存在する場合" do
        let!(:life_plan) { create(:life_plan, user:, start_from: 2026, end_to: 2060) }
        let!(:life_plan2) { create(:life_plan, user:, start_from: 2030, end_to: nil) }
        let!(:other_life_plan) { create(:life_plan, user: create(:user)) }

        it "自身のライフプラン一覧と200を返し、他ユーザーのものは含まれない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([
                                               {
                                                 "id" => life_plan.id,
                                                 "name" => life_plan.name,
                                                 "start_from" => 2026,
                                                 "end_to" => 2060
                                               },
                                               {
                                                 "id" => life_plan2.id,
                                                 "name" => life_plan2.name,
                                                 "start_from" => 2030,
                                                 "end_to" => nil
                                               }
                                             ])
        end
      end

      context "ライフプランが存在しない場合" do
        before { create(:life_plan, user: create(:user)) }

        it "空配列と200を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([])
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
