<template>
  <div class="stats-container">
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ totalUsers }}</h3>
          <p class="stat-label">Total de Usuários</p>
        </div>
      </div>
    </div>
    
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ favoritesCount }}</h3>
          <p class="stat-label">Favoritos</p>
        </div>
      </div>
    </div>
    
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon">🔍</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ filteredCount }}</h3>
          <p class="stat-label">Resultados</p>
        </div>
      </div>
    </div>
    
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon">🏢</div>
        <div class="stat-content">
          <h3 class="stat-number">{{ uniqueCompanies }}</h3>
          <p class="stat-label">Empresas</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  favorites: {
    type: Array,
    default: () => []
  },
  filteredUsers: {
    type: Array,
    default: () => []
  }
});

const totalUsers = computed(() => props.users.length);
const favoritesCount = computed(() => props.favorites.length);
const filteredCount = computed(() => props.filteredUsers.length);
const uniqueCompanies = computed(() => {
  const companies = new Set(props.users.map(user => user.company?.name).filter(Boolean));
  return companies.size;
});
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stats-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  
  .stats-card {
    padding: var(--spacing-md);
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style> 