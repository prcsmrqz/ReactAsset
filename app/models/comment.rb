class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user
  
  validates :commenter, :body, presence: true
end
