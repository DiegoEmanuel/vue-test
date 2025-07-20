<template>
  <div class="auth-view">
    <div class="auth-container">
      <!-- Login Form -->
      <LoginForm 
        v-if="authMode === 'login'"
        @switch-mode="switchMode"
        @login-success="handleLoginSuccess"
        class="auth-form-component"
      />
      
      <!-- Register Form -->
      <RegisterForm 
        v-if="authMode === 'register'"
        @switch-mode="switchMode"
        @register-success="handleRegisterSuccess"
        class="auth-form-component"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';

const authMode = ref('login');

const switchMode = (mode) => {
  authMode.value = mode;
};

const handleLoginSuccess = () => {
  // O login foi bem-sucedido, o composable já gerencia o estado
  // A aplicação principal detectará a mudança de autenticação
};

const handleRegisterSuccess = () => {
  // O registro foi bem-sucedido, o composable já gerencia o estado
  // A aplicação principal detectará a mudança de autenticação
};
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.auth-form-component {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 