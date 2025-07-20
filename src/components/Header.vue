<template>
  <!-- <header class="header"> -->
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1>👥 UserHub</h1>
        </div>
        <nav class="nav">
          <button 
            class="nav-btn" 
            :class="{ active: activeTab === 'users' }"
            @click="$emit('tab-change', 'users')"
          >
            <span class="nav-icon">👥</span>
            Usuários
          </button>
          <button 
            class="nav-btn" 
            :class="{ active: activeTab === 'favorites' }"
            @click="$emit('tab-change', 'favorites')"
          >
            <span class="nav-icon">⭐</span>
            Favoritos
            <span v-if="favoritesCount > 0" class="badge">{{ favoritesCount }}</span>
          </button>
        </nav>
        
        <div class="user-section">
          <div class="user-info" @click="showProfile = true">
            <div class="user-avatar">
              <span class="avatar-text">{{ userInitials }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ user?.name }}</span>
              <span class="user-role">{{ user?.role === 'admin' ? '👑 Admin' : '👤 User' }}</span>
            </div>
            <span class="dropdown-icon">▼</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de Perfil -->
    <UserProfile 
      v-if="showProfile" 
      @close="showProfile = false"
    />
  <!-- </header> -->
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '../composables/useAuth.js';
import UserProfile from './UserProfile.vue';

defineProps({
  activeTab: {
    type: String,
    default: 'users'
  },
  favoritesCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['tab-change']);

const { user } = useAuth();
const showProfile = ref(false);

const userInitials = computed(() => {
  if (!user.value?.name) return '?';
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  color: var(--text-primary);
}

.nav {
  display: flex;
  gap: var(--spacing-sm);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  font-weight: 500;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-btn:hover {
  background: var(--secondary-color);
  color: var(--text-primary);
}

.nav-btn.active {
  background: var(--primary-color);
  color: white;
}

.nav-icon {
  font-size: 1.1rem;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--error-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--secondary-color);
  border: 1px solid var(--border-color);
}

.user-info:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.user-role {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.dropdown-icon {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.user-info:hover .dropdown-icon {
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .nav {
    width: 100%;
    justify-content: center;
  }
  
  .nav-btn {
    flex: 1;
    justify-content: center;
  }
  
  .user-section {
    width: 100%;
    justify-content: center;
  }
  
  .user-info {
    width: 100%;
    justify-content: center;
  }
}
</style> 