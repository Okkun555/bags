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

  describe "#create" do
    subject { post "/api/life_plans", params: }

    let(:params) { { life_plan: { name:, start_from:, end_to: } } }
    let(:name) { "老後資金" }
    let(:start_from) { 2026 }
    let(:end_to) { 2060 }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメータが有効な場合" do
        it "ライフプランを作成し、201と作成したライフプランを返す" do
          expect { subject }.to change { user.life_plans.count }.by(1)
          expect(response).to have_http_status(:created)

          life_plan = user.life_plans.find_by(name:)
          expect(response.parsed_body).to eq({
                                               "id" => life_plan.id,
                                               "name" => name,
                                               "start_from" => 2026,
                                               "end_to" => 2060
                                             })
        end
      end

      context "終了年が未指定の場合" do
        let(:end_to) { nil }

        it "終了年nilで作成し、201を返す" do
          subject
          expect(response).to have_http_status(:created)
          expect(response.parsed_body["end_to"]).to be_nil
        end
      end

      context "同じユーザーで名前が重複している場合" do
        before { create(:life_plan, user:, name:) }

        it "422とエラー詳細を返し、作成されない" do
          expect { subject }.not_to change { LifePlan.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["code"]).to eq("unprocessable")
          expect(response.parsed_body["error"]["detail"]).to have_key("name")
        end
      end

      context "他ユーザーと名前が重複している場合" do
        before { create(:life_plan, user: create(:user), name:) }

        it "201を返す" do
          subject
          expect(response).to have_http_status(:created)
        end
      end

      context "開始年が終了年より後の場合" do
        let(:start_from) { 2061 }

        it "422とエラー詳細を返す" do
          expect { subject }.not_to change { LifePlan.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("end_to")
        end
      end

      context "名前が空の場合" do
        let(:name) { "" }

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("name")
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#update" do
    subject { put "/api/life_plans/#{life_plan_id}", params: }

    let!(:life_plan) { create(:life_plan, user:, name: "老後資金", start_from: 2026, end_to: 2060) }
    let(:life_plan_id) { life_plan.id }
    let(:params) { { life_plan: { name: "教育資金", start_from: 2027, end_to: nil } } }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "パラメータが有効な場合" do
        it "ライフプランを更新し、200と更新後のライフプランを返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq({
                                               "id" => life_plan.id,
                                               "name" => "教育資金",
                                               "start_from" => 2027,
                                               "end_to" => nil
                                             })
          expect(life_plan.reload.name).to eq("教育資金")
        end
      end

      context "自分の他のライフプランとタイトルが重複している場合" do
        before { create(:life_plan, user:, name: "教育資金") }

        it "422とエラー詳細を返し、更新されない" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("name")
          expect(life_plan.reload.name).to eq("老後資金")
        end
      end

      context "開始年が終了年より後の場合" do
        let(:params) { { life_plan: { name: "老後資金", start_from: 2061, end_to: 2060 } } }

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("end_to")
        end
      end

      context "他ユーザーのライフプランの場合" do
        let(:life_plan_id) { create(:life_plan, user: create(:user), name: "他人のプラン").id }

        it "404を返し、更新されない" do
          subject
          expect(response).to have_http_status(:not_found)
          expect(LifePlan.find(life_plan_id).name).to eq("他人のプラン")
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#destroy" do
    subject { delete "/api/life_plans/#{life_plan_id}" }

    let!(:life_plan) { create(:life_plan, user:) }
    let(:life_plan_id) { life_plan.id }

    context "ログイン済みの場合" do
      before do
        login_as(user)
      end

      context "配下に家族メンバー・収入・投資がある場合" do
        let!(:income) { create(:income, life_plan:) }
        let!(:investment) { create(:investment, life_plan:) }

        it "200を返し、ライフプランと配下のデータをすべて削除する" do
          expect { subject }.to change { LifePlan.count }.by(-1)
          expect(response).to have_http_status(:ok)
          expect(Income.where(life_plan_id: life_plan.id)).to be_empty
          expect(Investment.where(life_plan_id: life_plan.id)).to be_empty
          expect(FamilyMember.where(life_plan_id: life_plan.id)).to be_empty
        end
      end

      context "他ユーザーのライフプランの場合" do
        let!(:other_life_plan) { create(:life_plan, user: create(:user)) }
        let(:life_plan_id) { other_life_plan.id }

        it "404を返し、削除されない" do
          expect { subject }.not_to change { LifePlan.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
