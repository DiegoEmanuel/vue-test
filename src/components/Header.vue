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
      </div>
    </div>
  <!-- </header> -->
</template>

<script setup>
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
  color: var(--text-secondary);
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
}
</style> 