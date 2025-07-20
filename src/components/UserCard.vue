<template>
  <div class="user-card" :class="{ 'favorite': user.isFavorite }">
    <div class="card-header">
      <div class="user-avatar">
        <span class="avatar-text">{{ getUserInitials(user.name) }}</span>
      </div>
      <div class="user-info">
        <h3 class="user-name">{{ user.name }}</h3>
        <p class="user-username">@{{ user.username }}</p>
      </div>
      <button 
        @click="toggleFavorite" 
        class="favorite-btn"
        :class="{ active: user.isFavorite }"
        :title="user.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
      >
        {{ user.isFavorite ? '⭐' : '☆' }}
      </button>
    </div>
    
    <div class="card-body">
      <div class="contact-info">
        <div class="info-item">
          <span class="info-icon">📧</span>
          <a :href="`mailto:${user.email}`" class="info-link">{{ user.email }}</a>
        </div>
        <div class="info-item">
          <span class="info-icon">📱</span>
          <a :href="`tel:${user.phone}`" class="info-link">{{ user.phone }}</a>
        </div>
        <div class="info-item">
          <span class="info-icon">🌐</span>
          <a :href="user.website" target="_blank" class="info-link">{{ user.website }}</a>
        </div>
      </div>
      
      <div class="company-info">
        <h4 class="company-title">🏢 {{ user.company?.name }}</h4>
        <p class="company-catchphrase">{{ user.company?.catchPhrase }}</p>
      </div>
      
      <div class="address-info">
        <h4 class="address-title">📍 Endereço</h4>
        <p class="address-text">
          {{ user.address?.street }}, {{ user.address?.suite }}<br>
          {{ user.address?.city }} - {{ user.address?.zipcode }}
        </p>
      </div>
    </div>
    
    <div class="card-footer">
      <button @click="viewDetails" class="details-btn">
        👁️ Ver Detalhes
      </button>
      <button @click="viewPosts" class="posts-btn">
        📝 Posts
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-favorite', 'view-details', 'view-posts']);

const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const toggleFavorite = () => {
  emit('toggle-favorite', props.user.id);
};

const viewDetails = () => {
  emit('view-details', props.user);
};

const viewPosts = () => {
  emit('view-posts', props.user.id);
};
</script>

<style scoped>
.user-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.user-card.favorite {
  border-color: var(--warning-color);
  background: linear-gradient(135deg, #fff9c4 0%, #ffffff 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.user-username {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 50%;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
}

.favorite-btn:hover {
  background: var(--secondary-color);
  transform: scale(1.1);
}

.favorite-btn.active {
  color: var(--warning-color);
}

.card-body {
  margin-bottom: var(--spacing-lg);
}

.contact-info {
  margin-bottom: var(--spacing-lg);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.info-icon {
  font-size: 1rem;
  width: 20px;
}

.info-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.info-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.company-info,
.address-info {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--secondary-color);
  border-radius: var(--border-radius-md);
}

.company-title,
.address-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.company-catchphrase,
.address-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  gap: var(--spacing-sm);
}

.details-btn,
.posts-btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.details-btn:hover,
.posts-btn:hover {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .user-card {
    padding: var(--spacing-md);
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .user-info {
    text-align: center;
  }
  
  .favorite-btn {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
  
  .card-footer {
    flex-direction: column;
  }
}
</style>
  