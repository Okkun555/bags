require "rails_helper"

RSpec.describe Profile, type: :model do
  describe "validations" do
    let(:profile) { build :profile, date_of_birth: }

    describe "#date_of_birth_cannot_be_in_the_future" do
      context "生年月日が当日の場合" do
        let(:date_of_birth) { Date.today }

        it "有効であること" do
          expect(profile).to be_valid
        end
      end

      context "生年月日が未来日の場合" do
        let(:date_of_birth) { Date.tomorrow }

        it "無効となり、エラーメッセージが返ること" do
          expect(profile).to be_invalid
          expect(profile.errors[:date_of_birth]).to include('は未来の日付にできません')
        end
      end
    end

    describe "#date_of_must_be_realistic" do
      context "生年月日が150年前（境界値）の場合" do
        let(:date_of_birth) { 150.years.ago.to_date }

        it "有効であること" do
          expect(profile).to be_valid
        end
      end

      context "生年月日が150年前より過去の場合" do
        let(:date_of_birth) { 151.years.ago.to_date }

        it "無効となり、エラーメッセージが返ること" do
          expect(profile).to be_invalid
          expect(profile.errors[:date_of_birth]).to include('が正しくありません')
        end
      end
    end
  end
end
