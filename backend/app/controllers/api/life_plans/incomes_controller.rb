class Api::LifePlans::IncomesController < ApplicationController
  def index
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    authorize life_plan, :show?

    incomes = life_plan.incomes.order(:family_member_id, :start_from, :id)
    render json: IncomeSerializer.render_as_json(incomes), status: :ok
  end

  # 複数の収入を一度に登録する。1件でも不正な場合は何も登録しない
  def create
    life_plan = policy_scope(LifePlan).find(params[:life_plan_id])
    # MEMO: 登録先は同じライフプランなので、認可は行ごとではなくライフプランに対して1回だけ行う
    authorize life_plan, :update?
    return render_bad_request("収入の区分が不正です。") if invalid_amount_type?(incomes_params)

    incomes = incomes_params.map { |attrs| life_plan.incomes.build(income_attributes(attrs)) }

    errors = invalid_income_errors(incomes)
    return render_error(code: "unprocessable", message: "入力内容に不備があります。", status: :unprocessable_entity, details: errors) if errors.present?

    # MEMO: 直前にすべて検証済みなので、保存時は再検証しない
    Income.transaction { incomes.each { |income| income.save!(validate: false) } }
    render json: IncomeSerializer.render_as_json(incomes), status: :created
  end

  def update
    income = find_income
    authorize income

    return render_bad_request("収入の区分が不正です。") if invalid_amount_type?([ income_params ])

    income.update!(income_attributes(income_params))
    render json: IncomeSerializer.render_as_json(income), status: :ok
  end

  def destroy
    income = find_income
    authorize income

    income.destroy!
    render json: IncomeSerializer.render_as_json(income), status: :ok
  end

  private

  def find_income
    policy_scope(Income).where(life_plan_id: params[:life_plan_id]).find(params[:id])
  end

  PERMITTED_ATTRIBUTES = [ :family_member_id, :income_type, :amount, :amount_type, :start_from, :end_to, :memo ].freeze

  def incomes_params
    @incomes_params ||= params.expect(incomes: [ PERMITTED_ATTRIBUTES ])
  end

  def income_params
    params.expect(income: PERMITTED_ATTRIBUTES)
  end

  def invalid_amount_type?(list)
    list.any? { |attrs| attrs[:amount_type].present? && Income::AMOUNT_TYPES.exclude?(attrs[:amount_type]) }
  end

  # amount_type が monthly の場合は年額に変換する(未指定は年額として扱う)
  def income_attributes(attrs)
    attributes = attrs.to_h.symbolize_keys
    amount_type = attributes.delete(:amount_type)
    attributes[:amount] = Income.to_annual_amount(attributes[:amount], amount_type) if attributes.key?(:amount)
    attributes
  end

  # 各行を検証し、「incomes.<行番号>.<属性>」をキーにしたエラー詳細を返す
  def invalid_income_errors(incomes)
    incomes.each_with_index.each_with_object({}) do |(income, index), details|
      next if income.valid?

      income.errors.group_by(&:attribute).each do |attribute, errors|
        details["incomes.#{index}.#{attribute}"] = errors.map { |error| { message: error.full_message } }
      end
    end
  end
end
