<template>
  <div id="app">
    <!-- Loading inicial -->
    <div v-if="initialLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-spinner">⏳</div>
        <h2>Carregando UserHub...</h2>
      </div>
    </div>
    
    <!-- Tela de autenticação -->
    <AuthView v-else-if="!isAuthenticated" />
    
    <!-- Aplicação principal -->
    <HomeView v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from './composables/useAuth.js';
import AuthView from './views/AuthView.vue';
import HomeView from './views/HomeView.vue';

const { isAuthenticated, checkAuth } = useAuth();
const initialLoading = ref(true);

onMounted(() => {
  // Verificar autenticação no carregamento da aplicação
  checkAuth();
  
  // Simular um pequeno delay para mostrar a tela de loading
  setTimeout(() => {
    initialLoading.value = false;
  }, 1000);
});
</script>

<style>
/* Estilos globais já estão no style.css */

.loading-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  font-size: 3rem;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-content h2 {
  margin: 0;
  font-weight: 600;
  font-size: 1.5rem;
}
</style>
