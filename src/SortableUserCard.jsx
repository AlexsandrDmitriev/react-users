import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UserCard from './UserCard';
import styles from './SortableUserCard.module.scss';

function SortableUserCard({ user, onShowPosts, id, coords }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={styles.sortableUserCard}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        cursor: 'default',
      }}
      {...attributes}
    >
      <div
        {...listeners}
        className={styles.dragHandle}
        title="Drag"
      >
        ☰
      </div>
      <UserCard user={user} onShowPosts={onShowPosts} coords={coords} />
    </div>
  );
}

export default SortableUserCard;
