<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">
          <h1>👥 UserHub</h1>
        </div>
        <p class="auth-subtitle">Faça login para continuar</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <div class="password-input">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Sua senha"
              required
              :disabled="loading"
              class="form-input"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :disabled="loading"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="auth-button"
        >
          <span v-if="loading" class="loading-spinner">⏳</span>
          <span v-else>🔐 Entrar</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Não tem uma conta?</p>
        <button @click="$emit('switch-mode', 'register')" class="link-button">
          Criar conta
        </button>
      </div>

      <div class="demo-accounts">
        <h4>Contas de Demonstração:</h4>
        <div class="demo-account" @click="fillDemoAccount('admin')">
          <strong>Admin:</strong> admin@userhub.com / admin123
        </div>
        <div class="demo-account" @click="fillDemoAccount('user')">
          <strong>Usuário:</strong> user@userhub.com / user123
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const emit = defineEmits(['switch-mode', 'login-success']);

const { login, loading } = useAuth();

const form = ref({
  email: '',
  password: ''
});

const error = ref('');
const showPassword = ref(false);

const isFormValid = computed(() => {
  return form.value.email && form.value.password && form.value.email.includes('@');
});

const handleSubmit = async () => {
  error.value = '';
  
  try {
    await login(form.value.email, form.value.password);
    emit('login-success');
  } catch (err) {
    error.value = err.message;
  }
};

const fillDemoAccount = (type) => {
  if (type === 'admin') {
    form.value.email = 'admin@userhub.com';
    form.value.password = 'admin123';
  } else {
    form.value.email = 'user@userhub.com';
    form.value.password = 'user123';
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-md);
}

.auth-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 var(--spacing-sm) 0;
}

.auth-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.auth-form {
  margin-bottom: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  transition: all var(--transition-fast);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input:disabled {
  background: var(--secondary-color);
  cursor: not-allowed;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
}

.password-toggle:hover {
  background: var(--secondary-color);
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.error-message {
  background: var(--error-bg);
  color: var(--error-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1rem;
}

.auth-button {
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.auth-button:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.auth-footer p {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.link-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: all var(--transition-fast);
}

.link-button:hover {
  color: var(--primary-hover);
}

.demo-accounts {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.demo-accounts h4 {
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  font-size: 0.9rem;
  text-align: center;
}

.demo-account {
  background: var(--secondary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-sm);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--border-color);
}

.demo-account:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.demo-account:last-child {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .auth-card {
    padding: var(--spacing-xl);
    margin: var(--spacing-md);
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
}
</style> 