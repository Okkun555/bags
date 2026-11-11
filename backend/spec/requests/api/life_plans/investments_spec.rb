require "rails_helper"

RSpec.describe "Api::LifePlans::Investments", type: :request do
  let(:user) { create(:user) }
  let!(:life_plan) { create(:life_plan, user:) }
  let(:life_plan_id) { life_plan.id }
  let!(:member) { create(:family_member, life_plan:) }

  describe "#index" do
    subject { get "/api/life_plans/#{life_plan_id}/investments" }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "データが存在する場合" do
        let!(:later) { create(:investment, life_plan:, family_member: member, start_from: 2030, end_to: nil, memo: "メモ") }
        let!(:earlier) { create(:investment, life_plan:, family_member: member, start_from: 2026, end_to: 2029) }
        let!(:other_plan_record) { create(:investment, life_plan: create(:life_plan, user:)) }
        let!(:other_user_record) { create(:investment, life_plan: create(:life_plan, user: create(:user))) }

        it "指定したライフプランの一覧を開始年順で200で返し、他のものは含まれない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([
                                               {
                                                 "id" => earlier.id, "family_member_id" => member.id, "investment_type" => earlier.investment_type,
                                                 "amount" => earlier.amount, "start_from" => 2026, "end_to" => 2029, "memo" => nil
                                               },
                                               {
                                                 "id" => later.id, "family_member_id" => member.id, "investment_type" => later.investment_type,
                                                 "amount" => later.amount, "start_from" => 2030, "end_to" => nil, "memo" => "メモ"
                                               }
                                             ])
        end
      end

      context "データが存在しない場合" do
        it "空配列と200を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([])
        end
      end

      context "他ユーザーのライフプランの場合" do
        let(:life_plan_id) { create(:life_plan, user: create(:user)).id }

        it "404を返す" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#destroy" do
    subject { delete "/api/life_plans/#{life_plan_id}/investments/#{record_id}" }

    let!(:record) { create(:investment, life_plan:, family_member: member) }
    let(:record_id) { record.id }

    context "ログイン済みの場合" do
      before { login_as(user) }

      it "削除して200を返す" do
        expect { subject }.to change { Investment.count }.by(-1)
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["id"]).to eq(record.id)
      end

      context "他ユーザーのデータの場合" do
        let(:other_record) { create(:investment, life_plan: create(:life_plan, user: create(:user))) }
        let(:life_plan_id) { other_record.life_plan_id }
        let(:record_id) { other_record.id }

        it "404を返し、削除されない" do
          other_record
          expect { subject }.not_to change { Investment.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
