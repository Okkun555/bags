class Api::LifePlans::InvestmentsController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    investments = life_plan.investments.order(:family_member_id, :start_from, :id)
    render json: InvestmentSerializer.render_as_json(investments), status: :ok
  end

  # 複数の投資を一度に登録する。1件でも不正な場合は何も登録しない
  def create
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    # MEMO: 登録先は同じライフプランなので、認可は行ごとではなくライフプランに対して1回だけ行う
    authorize life_plan, :update?
    return render_bad_request("投資の区分が不正です。") if invalid_amount_type?(investments_params)

    investments = investments_params.map { |attrs| life_plan.investments.build(investment_attributes(attrs)) }

    errors = invalid_investment_errors(investments)
    return render_error(code: "unprocessable", message: "入力内容に不備があります。", status: :unprocessable_entity, details: errors) if errors.present?

    # MEMO: 直前にすべて検証済みなので、保存時は再検証しない
    Investment.transaction { investments.each { |investment| investment.save!(validate: false) } }
    render json: InvestmentSerializer.render_as_json(investments), status: :created
  end

  def update
    investment = find_investment
    authorize investment

    return render_bad_request("投資の区分が不正です。") if invalid_amount_type?([ investment_params ])

    investment.update!(investment_attributes(investment_params))
    render json: InvestmentSerializer.render_as_json(investment), status: :ok
  end

  def destroy
    investment = find_investment
    authorize investment

    investment.destroy!
    render json: InvestmentSerializer.render_as_json(investment), status: :ok
  end

  private

  def find_investment
    policy_scope(Investment).where(life_plan_id: params[:life_plan_id]).find(params[:id])
  end

  PERMITTED_ATTRIBUTES = [ :family_member_id, :investment_type, :amount, :amount_type, :start_from, :end_to, :memo ].freeze

  def investments_params
    @investments_params ||= params.expect(investments: [ PERMITTED_ATTRIBUTES ])
  end

  def investment_params
    params.expect(investment: PERMITTED_ATTRIBUTES)
  end

  def invalid_amount_type?(list)
    list.any? { |attrs| attrs[:amount_type].present? && Investment::AMOUNT_TYPES.exclude?(attrs[:amount_type]) }
  end

  # amount_type が monthly の場合は年額に変換する(未指定は年額として扱う)
  def investment_attributes(attrs)
    attributes = attrs.to_h.symbolize_keys
    amount_type = attributes.delete(:amount_type)
    attributes[:amount] = Investment.to_annual_amount(attributes[:amount], amount_type) if attributes.key?(:amount)
    attributes
  end

  # 各行を検証し、「investments.<行番号>.<属性>」をキーにしたエラー詳細を返す
  def invalid_investment_errors(investments)
    investments.each_with_index.each_with_object({}) do |(investment, index), details|
      next if investment.valid?

      investment.errors.group_by(&:attribute).each do |attribute, errors|
        details["investments.#{index}.#{attribute}"] = errors.map { |error| { message: error.full_message } }
      end
    end
  end
end
