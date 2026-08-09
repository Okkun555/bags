require "rails_helper"

RSpec.describe ProfilePolicy, type: :policy do
  subject { described_class }

  let(:user) { User.new }
  let(:profile) { Profile.new }

  permissions :create? do
    context "ログイン済みの場合" do
      it "許可されること" do
        expect(subject).to permit(user, profile)
      end
    end

    context "未ログインの場合" do
      let(:user) { nil }

      it "拒否されること" do
        expect(subject).not_to permit(user, profile)
      end
    end
  end
end
