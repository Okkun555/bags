require 'rails_helper'

RSpec.describe "Api::LifePlans::FamilyMembers", type: :request do
  let(:user) { create(:user) }
  let!(:life_plan) { create(:life_plan, user:) }
  let(:life_plan_id) { life_plan.id }

  describe "#index" do
    subject { get "/api/life_plans/#{life_plan_id}/family_members" }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "メンバーが存在する場合" do
        let!(:member) { create(:family_member, life_plan:, name: "太郎", relationship: "me", birthday: "1990-04-01") }
        let!(:member2) { create(:family_member, life_plan:, name: "花子", relationship: "spouse", birthday: "1992-08-15") }
        let!(:other_member) { create(:family_member, life_plan: create(:life_plan, user:)) }
        let!(:other_user_member) { create(:family_member, life_plan: create(:life_plan, user: create(:user))) }

        it "指定したライフプランのメンバー一覧と200を返し、他のライフプランのものは含まれない" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq([
                                               { "id" => member.id, "name" => "太郎", "relationship" => "me", "birthday" => "1990-04-01" },
                                               { "id" => member2.id, "name" => "花子", "relationship" => "spouse", "birthday" => "1992-08-15" }
                                             ])
        end
      end

      context "メンバーが存在しない場合" do
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
    subject { post "/api/life_plans/#{life_plan_id}/family_members", params: }

    let(:params) { { family_member: { name:, relationship:, birthday: } } }
    let(:name) { "太郎" }
    let(:relationship) { "me" }
    let(:birthday) { "1990-04-01" }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "パラメータが有効な場合" do
        it "メンバーを作成し、201と作成したメンバーを返す" do
          expect { subject }.to change { life_plan.family_members.count }.by(1)
          expect(response).to have_http_status(:created)

          member = life_plan.family_members.find_by(name:)
          expect(response.parsed_body).to eq({
                                               "id" => member.id,
                                               "name" => name,
                                               "relationship" => "me",
                                               "birthday" => "1990-04-01"
                                             })
        end
      end

      context "同じ続柄のメンバーを複数登録する場合" do
        before { create(:family_member, life_plan:, relationship: "child") }

        let(:relationship) { "child" }

        it "201を返す" do
          expect { subject }.to change { life_plan.family_members.count }.by(1)
          expect(response).to have_http_status(:created)
        end
      end

      context "名前が空の場合" do
        let(:name) { "" }

        it "422とエラー詳細を返し、作成されない" do
          expect { subject }.not_to change { FamilyMember.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["code"]).to eq("unprocessable")
          expect(response.parsed_body["error"]["detail"]).to have_key("name")
        end
      end

      context "生年月日が空の場合" do
        let(:birthday) { "" }

        it "422とエラー詳細を返す" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("birthday")
        end
      end

      context "続柄が不正な場合" do
        let(:relationship) { "friend" }

        it "422とエラー詳細を返し、作成されない" do
          expect { subject }.not_to change { FamilyMember.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("relationship")
        end
      end

      context "他ユーザーのライフプランの場合" do
        let(:life_plan_id) { create(:life_plan, user: create(:user)).id }

        it "404を返し、作成されない" do
          expect { subject }.not_to change { FamilyMember.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end

  describe "#update" do
    subject { put "/api/life_plans/#{life_plan_id}/family_members/#{member_id}", params: }

    let!(:member) { create(:family_member, life_plan:, name: "太郎", relationship: "me", birthday: "1990-04-01") }
    let(:member_id) { member.id }
    let(:params) { { family_member: { name: "次郎", relationship: "other", birthday: "1991-05-02" } } }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "パラメータが有効な場合" do
        it "メンバーを更新し、200と更新後のメンバーを返す" do
          subject
          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to eq({
                                               "id" => member.id,
                                               "name" => "次郎",
                                               "relationship" => "other",
                                               "birthday" => "1991-05-02"
                                             })
          expect(member.reload.name).to eq("次郎")
        end
      end

      context "名前が空の場合" do
        let(:params) { { family_member: { name: "" } } }

        it "422とエラー詳細を返し、更新されない" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.parsed_body["error"]["detail"]).to have_key("name")
          expect(member.reload.name).to eq("太郎")
        end
      end

      context "他ユーザーのメンバーの場合" do
        let(:other_member) { create(:family_member, life_plan: create(:life_plan, user: create(:user)), name: "他人") }
        let(:life_plan_id) { other_member.life_plan_id }
        let(:member_id) { other_member.id }

        it "404を返し、更新されない" do
          subject
          expect(response).to have_http_status(:not_found)
          expect(other_member.reload.name).to eq("他人")
        end
      end

      context "URLのライフプランに属さないメンバーの場合" do
        let(:member_id) { create(:family_member, life_plan: create(:life_plan, user:)).id }

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
    subject { delete "/api/life_plans/#{life_plan_id}/family_members/#{member_id}" }

    let!(:member) { create(:family_member, life_plan:) }
    let(:member_id) { member.id }

    context "ログイン済みの場合" do
      before { login_as(user) }

      context "収入・投資が紐づいていない場合" do
        it "200を返し、メンバーを削除する" do
          expect { subject }.to change { FamilyMember.count }.by(-1)
          expect(response).to have_http_status(:ok)
        end
      end

      context "収入が紐づいている場合" do
        before { create(:income, life_plan:, family_member: member) }

        it "409を返し、削除されない" do
          expect { subject }.not_to change { FamilyMember.count }
          expect(response).to have_http_status(:conflict)
          expect(response.parsed_body["error"]["code"]).to eq("conflict")
          expect(response.parsed_body["error"]["message"]).to eq("収入または投資が紐づいているため、削除できません。")
        end
      end

      context "投資が紐づいている場合" do
        before { create(:investment, life_plan:, family_member: member) }

        it "409を返し、削除されない" do
          expect { subject }.not_to change { FamilyMember.count }
          expect(response).to have_http_status(:conflict)
        end
      end

      context "他ユーザーのメンバーの場合" do
        let(:other_member) { create(:family_member, life_plan: create(:life_plan, user: create(:user))) }
        let(:life_plan_id) { other_member.life_plan_id }
        let(:member_id) { other_member.id }

        it "404を返し、削除されない" do
          other_member
          expect { subject }.not_to change { FamilyMember.count }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "未ログインの場合" do
      it_behaves_like 'requires authentication'
    end
  end
end
