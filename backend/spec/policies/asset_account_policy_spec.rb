require "rails_helper"

RSpec.describe AssetAccountPolicy, type: :policy do
  subject { described_class }

  let(:user) { User.new }
  let(:asset_account) { AssetAccount.new }

  permissions :index?, :create? do
    context "ログイン済みの場合" do
      it "許可されること" do
        expect(subject).to permit(user, asset_account)
      end
    end

    context "未ログインの場合" do
      let(:user) { nil }

      it "拒否されること" do
        expect(subject).not_to permit(user, asset_account)
      end
    end
  end

  permissions :show?, :update?, :destroy? do
    context '自分が作成した資産口座の場合' do
      it "許可されること" do
        asset_account = AssetAccount.new(user: user)
        expect(subject).to permit(user, asset_account)
      end
    end

    context "他人が作成した資産口座の場合" do
      it "拒否されること" do
        asset_account = AssetAccount.new(user: create(:user))
        expect(subject).not_to permit(user, asset_account)
      end
    end
  end
end