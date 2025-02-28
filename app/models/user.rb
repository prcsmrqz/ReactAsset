class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true

  validate :first_last_name
  validate :email_regex

  validates :password, confirmation: true

  private

  def email_regex
    if email.present? && (email.match(/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]{3,}\z/i).nil?)
      errors.add(:email, "must be a valid email address")
    end
  end

  def first_last_name
    if first_name.present? && first_name.length < 2
      errors.add(:first_name, "must be at least 2 letters")
    end
    if first_name.present? && first_name.match(/\A[a-zA-Z]+\z/).nil?
      errors.add(:first_name, "must contain only alphabets") 
    end
    
    if last_name.present? && last_name.length < 2
      errors.add(:last_name, "must be at least 2 letters") 
    end
    if last_name.present? && last_name.match(/\A[a-zA-Z]+\z/).nil?
      errors.add(:last_name, "must contain only alphabets")
    end
  end
end
