<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">
          <h1>👥 UserHub</h1>
        </div>
        <p class="auth-subtitle">Crie sua conta</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Seu nome completo"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

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
              placeholder="Mínimo 6 caracteres"
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
          <div class="password-strength" v-if="form.password">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :class="passwordStrength.class"
                :style="{ width: passwordStrength.percentage + '%' }"
              ></div>
            </div>
            <span class="strength-text" :class="passwordStrength.class">
              {{ passwordStrength.text }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <div class="password-input">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirme sua senha"
              required
              :disabled="loading"
              class="form-input"
              :class="{ 'error': form.confirmPassword && !passwordsMatch }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
              :disabled="loading"
            >
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <div v-if="form.confirmPassword && !passwordsMatch" class="error-hint">
            As senhas não coincidem
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.acceptTerms"
              type="checkbox"
              required
              :disabled="loading"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            Aceito os <button type="button" class="link-button">Termos de Uso</button> e 
            <button type="button" class="link-button">Política de Privacidade</button>
          </label>
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
          <span v-else>📝 Criar Conta</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Já tem uma conta?</p>
        <button @click="$emit('switch-mode', 'login')" class="link-button">
          Fazer login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const emit = defineEmits(['switch-mode', 'register-success']);

const { register, loading } = useAuth();

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const error = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword;
});

const passwordStrength = computed(() => {
  const password = form.value.password;
  if (!password) return { class: '', text: '', percentage: 0 };
  
  let score = 0;
  let feedback = [];
  
  // Comprimento
  if (password.length >= 6) score += 20;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  
  // Caracteres especiais
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;
  
  if (score < 40) {
    return { class: 'weak', text: 'Fraca', percentage: score };
  } else if (score < 70) {
    return { class: 'medium', text: 'Média', percentage: score };
  } else {
    return { class: 'strong', text: 'Forte', percentage: score };
  }
});

const isFormValid = computed(() => {
  return (
    form.value.name.trim() &&
    form.value.email.includes('@') &&
    form.value.password.length >= 6 &&
    passwordsMatch.value &&
    form.value.acceptTerms
  );
});

const handleSubmit = async () => {
  error.value = '';
  
  try {
    await register(
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.confirmPassword
    );
    emit('register-success');
  } catch (err) {
    error.value = err.message;
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
  max-width: 450px;
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

.form-input.error {
  border-color: var(--error-color);
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

.password-strength {
  margin-top: var(--spacing-xs);
}

.strength-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.strength-fill {
  height: 100%;
  transition: all var(--transition-fast);
}

.strength-fill.weak {
  background: var(--error-color);
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.strength-text.weak {
  color: var(--error-color);
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.strong {
  color: #10b981;
}

.error-hint {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: var(--spacing-xs);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all var(--transition-fast);
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
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
  padding: 0;
  font-size: inherit;
}

.link-button:hover {
  color: var(--primary-hover);
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