import React, { useState, useMemo, useEffect } from 'react'
import './App.scss'
import useFetch from './useFetch'
import PostList from './PostList'
import SortableUserCard from './SortableUserCard'
import { DndContext, MouseSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { API_BASE_URL } from './constants';

function getRandomCoords() {
  const minLat = 40.4774;   // Staten Island
  const maxLat = 40.9176;   // Bronx
  const minLng = -74.2591;  // Western Staten Island
  const maxLng = -73.6992;  // Eastern Queens
  const lat = +(Math.random() * (maxLat - minLat) + minLat).toFixed(6);
  const lng = +(Math.random() * (maxLng - minLng) + minLng).toFixed(6);
  return [lat, lng];
}

function App() {
  const { data, loading, error } = useFetch(`${API_BASE_URL}/users`)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPosts, setShowPosts] = useState(false)
  const [search, setSearch] = useState('')
  const [postsCache, setPostsCache] = useState({})
  const [userOrder, setUserOrder] = useState([])
  const [userCoords, setUserCoords] = useState({});

  // URL для постов выбранного пользователя
  const postsUrl = selectedUser ? `${API_BASE_URL}/posts?userId=${selectedUser.id}` : null
  const { data: posts, loading: postsLoading, error: postsError } = useFetch(postsUrl)

  // Кэшируем посты для фильтрации
  if (selectedUser && posts && !postsCache[selectedUser.id]) {
    setPostsCache(prev => ({ ...prev, [selectedUser.id]: posts }))
  }

  const handleShowPosts = (user) => {
    setSelectedUser(user)
    setShowPosts(true)
  }
  const handleClosePosts = () => {
    setShowPosts(false)
    setSelectedUser(null)
  }
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const sensors = useSensors(mouseSensor);

  useEffect(() => {
    if (data) {
      let saved = localStorage.getItem('userCoords');
      let coordsMap = saved ? JSON.parse(saved) : {};
      let changed = false;
      data.forEach(user => {
        if (!coordsMap[user.id]) {
          coordsMap[user.id] = getRandomCoords();
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('userCoords', JSON.stringify(coordsMap));
      }
      setUserCoords(coordsMap);
    }
  }, [data]);

  // Фильтрация пользователей и постов
  const filteredUsers = useMemo(() => {
    if (!data) return []
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(user => {
      const address = `${user.address.city}, ${user.address.street}, ${user.address.suite}, ${user.address.zipcode}`.toLowerCase()
      const userMatch =
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        address.includes(q)
      // Фильтрация по постам (если посты уже были загружены)
      const userPosts = postsCache[user.id] || []
      const postMatch = userPosts.some(post =>
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      )
      return userMatch || postMatch
    })
  }, [data, search, postsCache])

  // Сохраняем порядок пользователей после загрузки и при изменении фильтра
  useEffect(() => {
    if (data && (userOrder.length === 0 || userOrder.length !== filteredUsers.length)) {
      setUserOrder(filteredUsers.map(u => u.id));
    }
  }, [data, filteredUsers]);

  // Сортируем filteredUsers по userOrder, но только для id, которые есть в filteredUsers
  const orderedUsers = useMemo(() => {
    if (!filteredUsers.length) return [];
    const filteredIds = new Set(filteredUsers.map(u => u.id));
    return userOrder
      .filter(id => filteredIds.has(id))
      .map(id => filteredUsers.find(u => u.id === id))
      .filter(Boolean);
  }, [filteredUsers, userOrder]);

  // Drag and drop обработчик
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setUserOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="app-layout">
      <div className="users-panel">
        <h1 className="users-title">Users</h1>
        <input
          className="users-search"
          type="text"
          placeholder="Search users and posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedUsers.map(u => u.id)} strategy={verticalListSortingStrategy}>
            <div className="users-list">
              {orderedUsers.length === 0 && <div style={{ color: '#888', marginTop: 16 }}>No users</div>}
              {orderedUsers.map(user => (
                <SortableUserCard key={user.id} id={user.id} user={user} onShowPosts={handleShowPosts} coords={userCoords[user.id]} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {/* Правая область: посты */}
      <div className="posts-panel">
        {showPosts && selectedUser ? (
          <PostList
            user={selectedUser}
            posts={posts}
            loading={postsLoading}
            error={postsError}
            onClose={handleClosePosts}
          />
        ) : (
          <div className="posts-placeholder">Select a user to view their posts</div>
        )}
      </div>
    </div>
  )
}

export default App
