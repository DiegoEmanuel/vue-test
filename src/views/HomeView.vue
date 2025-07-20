<template>
  <div class="home-container">
    <Header 
      :active-tab="activeTab" 
      :favorites-count="favorites.length"
      @tab-change="handleTabChange"
    />
    
    <div class="container">
      <SearchBar 
        v-model="searchQuery"
        @search="handleSearch"
        @sort="handleSort"
      />
      
      <StatsCard 
        :users="users"
        :favorites="favorites"
        :filtered-users="displayedUsers"
      />
      
      <div v-if="loading" class="loading-section">
        <LoadingSpinner message="Carregando usuários..." />
      </div>
      
      <div v-else-if="error" class="error-section">
        <div class="error-card">
          <div class="error-icon">⚠️</div>
          <h3>Erro ao carregar usuários</h3>
          <p>{{ error }}</p>
          <button @click="loadUsers" class="retry-btn">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
      
      <div v-else>
        <div v-if="displayedUsers.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Nenhum usuário encontrado</h3>
          <p v-if="searchQuery || selectedFilter">
            Tente ajustar sua busca ou filtros
          </p>
          <p v-else>
            Não há usuários para exibir
          </p>
          <button v-if="searchQuery || selectedFilter" @click="clearAllFilters" class="clear-filters-btn">
            Limpar Filtros
          </button>
        </div>
        
        <div v-else class="users-grid">
          <UserCard 
            v-for="user in displayedUsers" 
            :key="user.id" 
            :user="user"
            @toggle-favorite="toggleFavorite"
            @view-details="viewUserDetails"
            @view-posts="viewUserPosts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Header from '../components/Header.vue';
import SearchBar from '../components/SearchBar.vue';
import UserCard from '../components/UserCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import StatsCard from '../components/StatsCard.vue';

// Estado reativo
const users = ref([]);
const favorites = ref([]);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('users');
const searchQuery = ref('');
const selectedFilter = ref('');
const sortDirection = ref('asc');

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value;
  
  // Aplicar busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => {
      if (selectedFilter.value === 'name') {
        return user.name.toLowerCase().includes(query);
      } else if (selectedFilter.value === 'email') {
        return user.email.toLowerCase().includes(query);
      } else if (selectedFilter.value === 'company') {
        return user.company?.name?.toLowerCase().includes(query);
      } else {
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.company?.name?.toLowerCase().includes(query)
        );
      }
    });
  }
  
  // Aplicar ordenação
  if (sortDirection.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();
      return sortDirection.value === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }
  
  return filtered;
});

const displayedUsers = computed(() => {
  if (activeTab.value === 'favorites') {
    return filteredUsers.value.filter(user => user.isFavorite);
  }
  return filteredUsers.value;
});

// Métodos
const loadUsers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    users.value = response.data.map(user => ({
      ...user,
      isFavorite: favorites.value.some(fav => fav.id === user.id)
    }));
  } catch (err) {
    error.value = 'Erro ao carregar usuários. Verifique sua conexão com a internet.';
    console.error('Erro ao carregar usuários:', err);
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tab) => {
  activeTab.value = tab;
};

const handleSearch = ({ query, filter }) => {
  searchQuery.value = query;
  selectedFilter.value = filter;
};

const handleSort = (direction) => {
  sortDirection.value = direction;
};

const toggleFavorite = (userId) => {
  const user = users.value.find(u => u.id === userId);
  if (user) {
    user.isFavorite = !user.isFavorite;
    
    if (user.isFavorite) {
      favorites.value.push(user);
    } else {
      favorites.value = favorites.value.filter(fav => fav.id !== userId);
    }
    
    // Salvar no localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  }
};

const viewUserDetails = (user) => {
  alert(`Detalhes do usuário: ${user.name}\nEmail: ${user.email}\nTelefone: ${user.phone}`);
};

const viewUserPosts = (userId) => {
  alert(`Abrindo posts do usuário ${userId}...`);
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedFilter.value = '';
  sortDirection.value = 'asc';
};

// Carregar favoritos do localStorage
const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites);
    }
  } catch (err) {
    console.error('Erro ao carregar favoritos:', err);
  }
};

// Lifecycle
onMounted(() => {
  loadFavorites();
  loadUsers();
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-section,
.error-section {
  padding: var(--spacing-2xl) 0;
}

.error-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.error-card h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.error-card p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0 auto;
}

.retry-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl) 0;
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.clear-filters-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-filters-btn:hover {
  background: var(--primary-hover);
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .users-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .error-card,
  .empty-state {
    margin: 0 var(--spacing-md);
  }
}
</style>
  