class Post < ApplicationRecord
    
    belongs_to :user
    has_many :comments, dependent: :destroy
    has_many :reading_list, dependent: :destroy
    has_one_attached :coverimg

    
    validates :title, :body, presence: true

    #get image url to display
    def coverimg_url
        coverimg.attached? ? Rails.application.routes.url_helpers.rails_blob_url(coverimg, only_path: true) : nil
    end
end
