class Post < ApplicationRecord
    validates :title, length: {maximum: 2}
end
