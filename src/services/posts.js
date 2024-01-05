const { queryDatabase } = require('./db');

// Add a post
const addPost = async (post) => {
  if (!post.title || !post.category || !post.description) {
    throw new Error('All fields are required');
  }

  try {
    await queryDatabase(
      `INSERT INTO posts (title, description, author, authorId, location, category, imageUrl, tags, likes, supports, flags, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.title,
        post.description,
        post.author,
        post.authorId,
        post.location,
        post.category,
        post.imageUrl,
        post.tags,
        post.likes,
        post.supports,
        post.flags,
        new Date(),
      ]
    );
    return { success: true, message: 'Post added successfully' };
  } catch (error) {
    throw new Error('Error adding post');
  }
};

// Get all posts
const getPostData = async () => {
  try {
    const results = await queryDatabase('SELECT * FROM posts ORDER BY timestamp DESC');
    return results;
  } catch (error) {
    throw new Error('Error fetching posts');
  }
};

// Delete a post
const deletePost = async (postId) => {
  try {
    await queryDatabase('DELETE FROM posts WHERE id = ?', [postId]);
    return { success: true, message: 'Post deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting post');
  }
};

module.exports = {
  addPost,
  getPostData,
  deletePost,
};