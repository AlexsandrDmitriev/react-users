import React from 'react';
import './PostList.scss';
import PostComments from './PostComments';

function PostList({ user, posts, loading, error, onClose }) {
  if (!user) return null;

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h2 className="post-list-title">
        User posts {user.name}
        </h2>
        <button className="post-list-close" onClick={onClose}>
        Hide posts
        </button>
      </div>
      {loading && <div>Loading posts...</div>}
      {error && <div style={{ color: 'red' }}>Error loading posts</div>}
      {posts && (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <div>{post.body}</div>
              <PostComments postId={post.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList; 