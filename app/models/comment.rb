class Comment < ApplicationRecord
  belongs_to :post

  validates :commenter, :body, presence: true
end
