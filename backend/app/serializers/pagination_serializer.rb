class PaginationSerializer < Blueprinter::Base
  field :current_page do |options|
    options.page
  end

  field :per_page do |options|
    options.limit
  end

  field :total_pages do |options|
    options.pages
  end

  field :total_count do |options|
    options.count
  end
end
