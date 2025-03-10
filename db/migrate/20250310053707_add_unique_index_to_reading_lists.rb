class AddUniqueIndexToReadingLists < ActiveRecord::Migration[6.0]
  def change
    add_index :reading_lists, [:user_id, :post_id], unique: true
  end
end
