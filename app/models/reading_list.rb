class ReadingList < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :post_id, uniqueness: { scope: :user_id, message: "is already added to your reading list" }
end
