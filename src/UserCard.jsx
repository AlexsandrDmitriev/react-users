import React, { useState, useEffect } from 'react';
import styles from './UserCard.module.scss';
import UserMap from './UserMap';
import stylesButton from './Button.module.scss';

function UserCard({ user, onShowPosts, coords }) {
  const { id, name, username, email, address, phone, website, company } = user;
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // Ключи для localStorage
  const likesKey = `user_likes_${id}`;
  const likedKey = `user_liked_${id}`;

  useEffect(() => {
    // Восстанавливаем количество лайков и статус лайка
    const savedLikes = localStorage.getItem(likesKey);
    const savedLiked = localStorage.getItem(likedKey);
    if (savedLikes) setLikes(Number(savedLikes));
    if (savedLiked === 'true') setLiked(true);
  }, [likesKey, likedKey]);

  const handleLike = () => {
    if (liked) return;
    const newLikes = likes + 1;
    setLikes(newLikes);
    setLiked(true);
    localStorage.setItem(likesKey, newLikes);
    localStorage.setItem(likedKey, 'true');
  };

  const addressText = `${address.city}, ${address.street}, ${address.suite}, ${address.zipcode}`;
  const companyText = company?.name || '';

  return (
    <div className={styles.userCard}>
      <div className={styles.userName}>👤 {name}</div>
      <div className={styles.userField}><b>🆔 Username:</b> {username}</div>
      <div className={styles.userEmail}><b>✉️ Email:</b> {email}</div>
      <div className={styles.userField}><b>📍 Address:</b> {addressText}</div>
      <div className={styles.userField}><b>📞 Phone:</b> {phone}</div>
      <div className={styles.userField}><b>🌐 Website:</b> {website}</div>
      <div className={styles.userField}><b>🏢 Company:</b> {company?.name}</div>
      <UserMap
        lat={coords?.[0]}
        lng={coords?.[1]}
        address={addressText}
        addressText={companyText}
      />
      <div className={stylesButton.userCardActions}>
        <button
          className={`${stylesButton.button} ${stylesButton.like}`}
          onClick={handleLike}
          disabled={liked}
          title={liked ? 'You already liked it' : 'Like'}
        >
          <span className="like-icon">👍</span> {likes}
        </button>
        <button
          className={`${stylesButton.button} ${stylesButton.posts}`}
          onClick={() => onShowPosts(user)}
        >
          Show user posts
        </button>
      </div>
    </div>
  );
}

export default UserCard; 