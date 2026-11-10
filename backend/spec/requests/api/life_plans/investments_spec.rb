require 'rails_helper'

RSpec.describe "Api::LifePlans::Investments", type: :request do
  let(:user) { create(:user) }
  let!(:life_plan) { create(:life_plan, user:) }
  let(:life_plan_id) { life_plan.id }
  let!(:member) { create(:family_member, life_plan:) }

  describe "#index" do
    subject { get "/api/life_plans/#{life_plan_id}/investments" }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "投資が存在する場合" do
        let!(:investment) { create(:investment, life_plan:, family_member: member, investment_type: "stock", amount: 4_800_000, start_from: 2026, end_to: 2040, memo: "積立") }
        let!(:investment2) { create(:investment, life_plan:, family_member: member, investment_type: "insurance", amount: 120_000, start_from: 2030, end_to: nil) }
        let!(:other_plan_investment) { create(:investment, life_plan: create(:life_plan, user:)) }
        let!(:other_user_investment) { create(:investment, life_plan: create(:life_plan, user: create(:user))) }

        it "指定したライフプランの投資一覧と200を返し、他のライフプラン・他ユーザーのものは含まれない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([
                                               {
                                                 "id" => investment.id,
                                                 "family_member_id" => member.id,
                                                 "investment_type" => "stock",
                                                 "amount" => 4_800_000,
                                                 "start_from" => 2026,
                                                 "end_to" => 2040,
                                                 "memo" => "積立"
                                               },
                                               {
                                                 "id" => investment2.id,
                                                 "family_member_id" => member.id,
                                                 "investment_type" => "insurance",
                                                 "amount" => 120_000,
                                                 "start_from" => 2030,
                                                 "end_to" => nil,
                                                 "memo" => nil
                                               }
                                             ])
        end
      end

      context "投資が存在しない場合" do
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

  describe "#create" do
    subject { post "/api/life_plans/#{life_plan_id}/investments", params: { investments: } }

    let(:investments) do
      [
        { family_member_id: member.id, investment_type: "stock", amount: 4_800_000, amount_type: "annual", start_from: 2026, end_to: 2040, memo: "積立" },
        { family_member_id: member.id, investment_type: "insurance", amount: 800_000, amount_type: "annual", start_from: 2026, end_to: "" }
      ]
    end

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "複数の投資が有効な場合" do
        it "すべて作成し、201と作成した投資を返す" do
          expect { subject }.to change { life_plan.investments.count }.by(2)
          expect(response).to have_http_status(:created)

          expect(response.parsed_body.pluck("investment_type", "amount", "end_to")).to eq([
                                                                                       [ "stock", 4_800_000, 2040 ],
                                                                                       [ "insurance", 800_000, nil ]
                                                                                     ])
          expect(response.parsed_body.first["family_member_id"]).to eq(member.id)
        end
      end

      context "月額で入力した場合" do
        let(:investments) do
          [ { family_member_id: member.id, investment_type: "stock", amount: 250_000, amount_type: "monthly", start_from: 2026 } ]
        end

        it "12倍した年額で保存する" do
          expect { subject }.to change { life_plan.investments.count }.by(1)
          expect(response).to have_http_status(:created)
          expect(response.parsed_body.first["amount"]).to eq(3_000_000)
          expect(life_plan.investments.last.amount).to eq(3_000_000)
        end
      end

      context "amount_typeが未指定の場合" do
        let(:investments) do
          [ { family_member_id: member.id, investment_type: "stock", amount: 250_000, start_from: 2026 } ]
        end

        it "年額として保存する" do
          subject
          expect(response).to have_http_status(:created)
          expect(response.parsed_body.first["amount"]).to eq(250_000)
        end
      end

      context "amount_typeが不正な場合" do
        let(:investments) do
          [ { family_member_id: member.id, investment_type: "stock", amount: 250_000, amount_type: "weekly", start_from: 2026 } ]
        end

        it "400を返し、作成されない" do
          expect { subject }.not_to change { Investment.count }
          expect(response).to have_http_status(:bad_request)
        end
      end

      context "一部の行が不正な場合" do
        let(:investments) do
          [
            { family_member_id: member.id, investment_type: "stock", amount: 4_800_000, amount_type: "annual", start_from: 2026 },
            { family_member_id: member.id, investment_type: "insurance", amount: 0, amount_type: "annual", start_from: 2026 }
          ]
        end

        it "422と行番号付きのエラー詳細を返し、1件も作成されない" do
          expect { subject }.not_to change { Investment.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["code"]).to eq("unprocessable")
          expect(response.parsed_body["error"]["detail"].keys).to eq([ "investments.1.amount" ])
        end
      end

      context "開始年が終了年より後の場合" do
        let(:investments) do
          [ { family_member_id: member.id, investment_type: "stock", amount: 100, amount_type: "annual", start_from: 2041, end_to: 2040 } ]
        end

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("investments.0.end_to")
        end
      end

      context "投資種別が不正な場合" do
        let(:investments) do
          [ { family_member_id: member.id, investment_type: "invalid", amount: 100, amount_type: "annual", start_from: 2026 } ]
        end

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("investments.0.investment_type")
        end
      end

      context "別のライフプランのメンバーを指定した場合" do
        let(:other_member) { create(:family_member, life_plan: create(:life_plan, user:)) }
        let(:investments) do
          [ { family_member_id: other_member.id, investment_type: "stock", amount: 100, amount_type: "annual", start_from: 2026 } ]
        end

        it "422とエラー詳細を返し、作成されない" do
          expect { subject }.not_to change { Investment.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("investments.0.family_member")
        end
      end

      context "月額を12倍するとinteger上限を超える場合" do
        let(:investments) do
          [ { family_member_id: member.id, investment_type: "stock", amount: 200_000_000, amount_type: "monthly", start_from: 2026 } ]
        end

        it "422を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("investments.0.amount")
        end
      end

      context "他ユーザーのライフプランの場合" do
        let(:life_plan_id) { create(:life_plan, user: create(:user)).id }

        it "404を返し、作成されない" do
          expect { subject }.not_to change { Investment.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#update" do
    subject { put "/api/life_plans/#{life_plan_id}/investments/#{investment_id}", params: { investment: investment_params } }

    let!(:investment) { create(:investment, life_plan:, family_member: member, investment_type: "stock", amount: 3_000_000, start_from: 2026, end_to: 2030) }
    let(:investment_id) { investment.id }
    let(:investment_params) { { investment_type: "insurance", amount: 500_000, amount_type: "annual", start_from: 2027, end_to: "", memo: "保険料" } }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "パラメータが有効な場合" do
        it "投資を更新し、200と更新後の投資を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq({
                                               "id" => investment.id,
                                               "family_member_id" => member.id,
                                               "investment_type" => "insurance",
                                               "amount" => 500_000,
                                               "start_from" => 2027,
                                               "end_to" => nil,
                                               "memo" => "保険料"
                                             })
          expect(investment.reload.amount).to eq(500_000)
        end
      end

      context "月額で入力した場合" do
        let(:investment_params) { { amount: 100_000, amount_type: "monthly" } }

        it "12倍した年額で保存する" do
          subject
          expect(response).to have_http_status(:ok)
          expect(investment.reload.amount).to eq(1_200_000)
        end
      end

      context "amountを送らない場合" do
        let(:investment_params) { { memo: "更新" } }

        it "金額は変更されない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(investment.reload.amount).to eq(3_000_000)
          expect(investment.memo).to eq("更新")
        end
      end

      context "金額が0の場合" do
        let(:investment_params) { { amount: 0, amount_type: "annual" } }

        it "422とエラー詳細を返し、更新されない" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("amount")
          expect(investment.reload.amount).to eq(3_000_000)
        end
      end

      context "他ユーザーの投資の場合" do
        let(:other_investment) { create(:investment, life_plan: create(:life_plan, user: create(:user))) }
        let(:life_plan_id) { other_investment.life_plan_id }
        let(:investment_id) { other_investment.id }

        it "404を返し、更新されない" do
          expect { subject }.not_to change { other_investment.reload.amount }
          expect(response).to have_http_status(:not_found)
        end
      end

      context "URLのライフプランに属さない投資の場合" do
        let(:investment_id) { create(:investment, life_plan: create(:life_plan, user:)).id }

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
    subject { delete "/api/life_plans/#{life_plan_id}/investments/#{investment_id}" }

    let!(:investment) { create(:investment, life_plan:, family_member: member) }
    let(:investment_id) { investment.id }

    context "ログイン済みの場合" do
      before { login_as(user) }

      it "200を返し、投資を削除する" do
        expect { subject }.to change { Investment.count }.by(-1)
        expect(response).to have_http_status(:ok)
      end

      context "他ユーザーの投資の場合" do
        let(:other_investment) { create(:investment, life_plan: create(:life_plan, user: create(:user))) }
        let(:life_plan_id) { other_investment.life_plan_id }
        let(:investment_id) { other_investment.id }

        it "404を返し、削除されない" do
          other_investment
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
