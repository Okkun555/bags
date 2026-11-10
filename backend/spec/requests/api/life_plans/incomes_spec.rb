require 'rails_helper'

RSpec.describe "Api::LifePlans::Incomes", type: :request do
  let(:user) { create(:user) }
  let!(:life_plan) { create(:life_plan, user:) }
  let(:life_plan_id) { life_plan.id }
  let!(:member) { create(:family_member, life_plan:) }

  describe "#index" do
    subject { get "/api/life_plans/#{life_plan_id}/incomes" }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "収入が存在する場合" do
        let!(:income) { create(:income, life_plan:, family_member: member, income_type: "salary", amount: 4_800_000, start_from: 2026, end_to: 2040, memo: "手取り") }
        let!(:income2) { create(:income, life_plan:, family_member: member, income_type: "dividend", amount: 120_000, start_from: 2030, end_to: nil) }
        let!(:other_plan_income) { create(:income, life_plan: create(:life_plan, user:)) }
        let!(:other_user_income) { create(:income, life_plan: create(:life_plan, user: create(:user))) }

        it "指定したライフプランの収入一覧と200を返し、他のライフプラン・他ユーザーのものは含まれない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([
                                               {
                                                 "id" => income.id,
                                                 "family_member_id" => member.id,
                                                 "income_type" => "salary",
                                                 "amount" => 4_800_000,
                                                 "start_from" => 2026,
                                                 "end_to" => 2040,
                                                 "memo" => "手取り"
                                               },
                                               {
                                                 "id" => income2.id,
                                                 "family_member_id" => member.id,
                                                 "income_type" => "dividend",
                                                 "amount" => 120_000,
                                                 "start_from" => 2030,
                                                 "end_to" => nil,
                                                 "memo" => nil
                                               }
                                             ])
        end
      end

      context "収入が存在しない場合" do
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
    subject { post "/api/life_plans/#{life_plan_id}/incomes", params: { incomes: } }

    let(:incomes) do
      [
        { family_member_id: member.id, income_type: "salary", amount: 4_800_000, amount_type: "annual", start_from: 2026, end_to: 2040, memo: "手取り" },
        { family_member_id: member.id, income_type: "bonus", amount: 800_000, amount_type: "annual", start_from: 2026, end_to: "" }
      ]
    end

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "複数の収入が有効な場合" do
        it "すべて作成し、201と作成した収入を返す" do
          expect { subject }.to change { life_plan.incomes.count }.by(2)
          expect(response).to have_http_status(:created)

          expect(response.parsed_body.pluck("income_type", "amount", "end_to")).to eq([
                                                                                       [ "salary", 4_800_000, 2040 ],
                                                                                       [ "bonus", 800_000, nil ]
                                                                                     ])
          expect(response.parsed_body.first["family_member_id"]).to eq(member.id)
        end
      end

      context "月額で入力した場合" do
        let(:incomes) do
          [ { family_member_id: member.id, income_type: "salary", amount: 250_000, amount_type: "monthly", start_from: 2026 } ]
        end

        it "12倍した年額で保存する" do
          expect { subject }.to change { life_plan.incomes.count }.by(1)
          expect(response).to have_http_status(:created)
          expect(response.parsed_body.first["amount"]).to eq(3_000_000)
          expect(life_plan.incomes.last.amount).to eq(3_000_000)
        end
      end

      context "amount_typeが未指定の場合" do
        let(:incomes) do
          [ { family_member_id: member.id, income_type: "salary", amount: 250_000, start_from: 2026 } ]
        end

        it "年額として保存する" do
          subject
          expect(response).to have_http_status(:created)
          expect(response.parsed_body.first["amount"]).to eq(250_000)
        end
      end

      context "amount_typeが不正な場合" do
        let(:incomes) do
          [ { family_member_id: member.id, income_type: "salary", amount: 250_000, amount_type: "weekly", start_from: 2026 } ]
        end

        it "400を返し、作成されない" do
          expect { subject }.not_to change { Income.count }
          expect(response).to have_http_status(:bad_request)
        end
      end

      context "一部の行が不正な場合" do
        let(:incomes) do
          [
            { family_member_id: member.id, income_type: "salary", amount: 4_800_000, amount_type: "annual", start_from: 2026 },
            { family_member_id: member.id, income_type: "bonus", amount: 0, amount_type: "annual", start_from: 2026 }
          ]
        end

        it "422と行番号付きのエラー詳細を返し、1件も作成されない" do
          expect { subject }.not_to change { Income.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["code"]).to eq("unprocessable")
          expect(response.parsed_body["error"]["detail"].keys).to eq([ "incomes.1.amount" ])
        end
      end

      context "開始年が終了年より後の場合" do
        let(:incomes) do
          [ { family_member_id: member.id, income_type: "salary", amount: 100, amount_type: "annual", start_from: 2041, end_to: 2040 } ]
        end

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("incomes.0.end_to")
        end
      end

      context "収入種別が不正な場合" do
        let(:incomes) do
          [ { family_member_id: member.id, income_type: "invalid", amount: 100, amount_type: "annual", start_from: 2026 } ]
        end

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("incomes.0.income_type")
        end
      end

      context "別のライフプランのメンバーを指定した場合" do
        let(:other_member) { create(:family_member, life_plan: create(:life_plan, user:)) }
        let(:incomes) do
          [ { family_member_id: other_member.id, income_type: "salary", amount: 100, amount_type: "annual", start_from: 2026 } ]
        end

        it "422とエラー詳細を返し、作成されない" do
          expect { subject }.not_to change { Income.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("incomes.0.family_member")
        end
      end

      context "月額を12倍するとinteger上限を超える場合" do
        let(:incomes) do
          [ { family_member_id: member.id, income_type: "salary", amount: 200_000_000, amount_type: "monthly", start_from: 2026 } ]
        end

        it "422を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("incomes.0.amount")
        end
      end

      context "他ユーザーのライフプランの場合" do
        let(:life_plan_id) { create(:life_plan, user: create(:user)).id }

        it "404を返し、作成されない" do
          expect { subject }.not_to change { Income.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#update" do
    subject { put "/api/life_plans/#{life_plan_id}/incomes/#{income_id}", params: { income: income_params } }

    let!(:income) { create(:income, life_plan:, family_member: member, income_type: "salary", amount: 3_000_000, start_from: 2026, end_to: 2030) }
    let(:income_id) { income.id }
    let(:income_params) { { income_type: "bonus", amount: 500_000, amount_type: "annual", start_from: 2027, end_to: "", memo: "賞与" } }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "パラメータが有効な場合" do
        it "収入を更新し、200と更新後の収入を返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq({
                                               "id" => income.id,
                                               "family_member_id" => member.id,
                                               "income_type" => "bonus",
                                               "amount" => 500_000,
                                               "start_from" => 2027,
                                               "end_to" => nil,
                                               "memo" => "賞与"
                                             })
          expect(income.reload.amount).to eq(500_000)
        end
      end

      context "月額で入力した場合" do
        let(:income_params) { { amount: 100_000, amount_type: "monthly" } }

        it "12倍した年額で保存する" do
          subject
          expect(response).to have_http_status(:ok)
          expect(income.reload.amount).to eq(1_200_000)
        end
      end

      context "amountを送らない場合" do
        let(:income_params) { { memo: "更新" } }

        it "金額は変更されない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(income.reload.amount).to eq(3_000_000)
          expect(income.memo).to eq("更新")
        end
      end

      context "金額が0の場合" do
        let(:income_params) { { amount: 0, amount_type: "annual" } }

        it "422とエラー詳細を返し、更新されない" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("amount")
          expect(income.reload.amount).to eq(3_000_000)
        end
      end

      context "他ユーザーの収入の場合" do
        let(:other_income) { create(:income, life_plan: create(:life_plan, user: create(:user))) }
        let(:life_plan_id) { other_income.life_plan_id }
        let(:income_id) { other_income.id }

        it "404を返し、更新されない" do
          expect { subject }.not_to change { other_income.reload.amount }
          expect(response).to have_http_status(:not_found)
        end
      end

      context "URLのライフプランに属さない収入の場合" do
        let(:income_id) { create(:income, life_plan: create(:life_plan, user:)).id }

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
    subject { delete "/api/life_plans/#{life_plan_id}/incomes/#{income_id}" }

    let!(:income) { create(:income, life_plan:, family_member: member) }
    let(:income_id) { income.id }

    context "ログイン済みの場合" do
      before { login_as(user) }

      it "200を返し、収入を削除する" do
        expect { subject }.to change { Income.count }.by(-1)
        expect(response).to have_http_status(:ok)
      end

      context "他ユーザーの収入の場合" do
        let(:other_income) { create(:income, life_plan: create(:life_plan, user: create(:user))) }
        let(:life_plan_id) { other_income.life_plan_id }
        let(:income_id) { other_income.id }

        it "404を返し、削除されない" do
          other_income
          expect { subject }.not_to change { Income.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
