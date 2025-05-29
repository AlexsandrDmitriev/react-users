import React, { useEffect, useState } from 'react';
import styles from './PostComments.module.scss';
import { API_BASE_URL } from './constants';

function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/posts/${postId}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [postId]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading comments</div>;
  if (!comments.length) return <div>No comments</div>;

  return (
    <div className={styles.comments}>
      <h4>Comments</h4>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <b>{c.name}</b> <span>({c.email})</span>
            <div>{c.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostComments;
