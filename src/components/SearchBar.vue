<template>
  <div class="search-container">
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar usuários..."
          class="search-input"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          class="clear-btn"
        >
          ✕
        </button>
      </div>
      
      <div class="filters">
        <select v-model="selectedFilter" @change="handleFilterChange" class="filter-select">
          <option value="">Todos</option>
          <option value="name">Nome</option>
          <option value="email">Email</option>
          <option value="company">Empresa</option>
        </select>
        
        <button 
          @click="toggleSort" 
          class="sort-btn"
          :class="{ active: isSorted }"
        >
          {{ sortDirection === 'asc' ? '↑' : '↓' }} Ordenar
        </button>
      </div>
    </div>
    
    <div v-if="searchQuery || selectedFilter" class="active-filters">
      <span class="filter-tag">
        Busca: "{{ searchQuery }}"
        <button @click="clearSearch" class="remove-filter">✕</button>
      </span>
      <span v-if="selectedFilter" class="filter-tag">
        Filtro: {{ getFilterLabel(selectedFilter) }}
        <button @click="clearFilter" class="remove-filter">✕</button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'search', 'filter', 'sort']);

const searchQuery = ref(props.modelValue);
const selectedFilter = ref('');
const sortDirection = ref('asc');
const isSorted = ref(false);

const handleSearch = () => {
  emit('update:modelValue', searchQuery.value);
  emit('search', {
    query: searchQuery.value,
    filter: selectedFilter.value
  });
};

const handleFilterChange = () => {
  emit('search', {
    query: searchQuery.value,
    filter: selectedFilter.value
  });
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('update:modelValue', '');
  emit('search', {
    query: '',
    filter: selectedFilter.value
  });
};

const clearFilter = () => {
  selectedFilter.value = '';
  emit('search', {
    query: searchQuery.value,
    filter: ''
  });
};

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  isSorted.value = true;
  emit('sort', sortDirection.value);
};

const getFilterLabel = (filter) => {
  const labels = {
    name: 'Nome',
    email: 'Email',
    company: 'Empresa'
  };
  return labels[filter] || filter;
};

watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue;
});
</script>

<style scoped>
.search-container {
  margin-bottom: var(--spacing-lg);
}

.search-bar {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) 2.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  font-size: 1rem;
  transition: all var(--transition-fast);
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.clear-btn {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--secondary-color);
  color: var(--text-primary);
}

.filters {
  display: flex;
  gap: var(--spacing-sm);
}

.filter-select,
.sort-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-select:focus,
.sort-btn:focus {
  outline: none;
  border-color: var(--primary-color);
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 500;
}

.sort-btn:hover {
  background: var(--secondary-color);
}

.sort-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.active-filters {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-md);
  font-size: 0.85rem;
  font-weight: 500;
}

.remove-filter {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  font-size: 0.8rem;
  transition: background var(--transition-fast);
}

.remove-filter:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input-wrapper {
    min-width: auto;
  }
  
  .filters {
    justify-content: space-between;
  }
  
  .filter-select,
  .sort-btn {
    flex: 1;
  }
}
</style> 