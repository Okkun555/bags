class Api::ProfilesController < ApplicationController
  def create
    return render_conflict(I18n.t("errors.profile.already_exist")) if current_user.profile.present?

    profile = current_user.build_profile(profile_params)
    authorize profile

    if profile.save!
      render json: ProfileSerializer.render_as_json(profile), status: :created
    end
  end

  private

  def profile_params
    params.expect(profile: [:name, :date_of_birth, :gender, :prefecture_id, :marital_status, :occupation_id, :income])
  end
end
