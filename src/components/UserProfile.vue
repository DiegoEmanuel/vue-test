<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <span class="avatar-text">{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <h2>{{ user?.name }}</h2>
          <p class="user-email">{{ user?.email }}</p>
          <span class="user-role" :class="user?.role">
            {{ user?.role === 'admin' ? '👑 Administrador' : '👤 Usuário' }}
          </span>
        </div>
      </div>

      <div class="profile-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'profile' }"
          @click="activeTab = 'profile'"
        >
          👤 Perfil
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'password' }"
          @click="activeTab = 'password'"
        >
          🔐 Senha
        </button>
      </div>

      <!-- Tab de Perfil -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <form @submit.prevent="handleProfileUpdate" class="profile-form">
          <div class="form-group">
            <label for="profileName">Nome Completo</label>
            <input
              id="profileName"
              v-model="profileForm.name"
              type="text"
              placeholder="Seu nome completo"
              required
              :disabled="loading"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="profileEmail">Email</label>
            <input
              id="profileEmail"
              v-model="profileForm.email"
              type="email"
              placeholder="seu@email.com"
              required
              :disabled="loading"
              class="form-input"
            />
          </div>

          <div v-if="profileError" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ profileError }}
          </div>

          <div v-if="profileSuccess" class="success-message">
            <span class="success-icon">✅</span>
            {{ profileSuccess }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="update-button"
          >
            <span v-if="loading" class="loading-spinner">⏳</span>
            <span v-else>💾 Salvar Alterações</span>
          </button>
        </form>
      </div>

      <!-- Tab de Senha -->
      <div v-if="activeTab === 'password'" class="tab-content">
        <form @submit.prevent="handlePasswordChange" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Senha Atual</label>
            <div class="password-input">
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Sua senha atual"
                required
                :disabled="loading"
                class="form-input"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="password-toggle"
                :disabled="loading"
              >
                {{ showCurrentPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="newPassword">Nova Senha</label>
            <div class="password-input">
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Mínimo 6 caracteres"
                required
                :disabled="loading"
                class="form-input"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="password-toggle"
                :disabled="loading"
              >
                {{ showNewPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div class="password-strength" v-if="passwordForm.newPassword">
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
            <label for="confirmNewPassword">Confirmar Nova Senha</label>
            <div class="password-input">
              <input
                id="confirmNewPassword"
                v-model="passwordForm.confirmNewPassword"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                placeholder="Confirme a nova senha"
                required
                :disabled="loading"
                class="form-input"
                :class="{ 'error': passwordForm.confirmNewPassword && !passwordsMatch }"
              />
              <button
                type="button"
                @click="showConfirmNewPassword = !showConfirmNewPassword"
                class="password-toggle"
                :disabled="loading"
              >
                {{ showConfirmNewPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="passwordForm.confirmNewPassword && !passwordsMatch" class="error-hint">
              As senhas não coincidem
            </div>
          </div>

          <div v-if="passwordError" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ passwordError }}
          </div>

          <div v-if="passwordSuccess" class="success-message">
            <span class="success-icon">✅</span>
            {{ passwordSuccess }}
          </div>

          <button
            type="submit"
            :disabled="loading || !isPasswordFormValid"
            class="update-button"
          >
            <span v-if="loading" class="loading-spinner">⏳</span>
            <span v-else>🔐 Alterar Senha</span>
          </button>
        </form>
      </div>

      <div class="profile-footer">
        <button @click="$emit('close')" class="close-button">
          ✕ Fechar
        </button>
        <button @click="handleLogout" class="logout-button">
          🚪 Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const emit = defineEmits(['close']);

const { user, loading, updateProfile, changePassword, logout } = useAuth();

const activeTab = ref('profile');
const profileError = ref('');
const profileSuccess = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');

// Form de perfil
const profileForm = ref({
  name: '',
  email: ''
});

// Form de senha
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

// Estados de visibilidade das senhas
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

// Computed properties
const userInitials = computed(() => {
  if (!user.value?.name) return '?';
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmNewPassword;
});

const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword;
  if (!password) return { class: '', text: '', percentage: 0 };
  
  let score = 0;
  
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

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword.length >= 6 &&
    passwordsMatch.value
  );
});

// Métodos
const handleProfileUpdate = async () => {
  profileError.value = '';
  profileSuccess.value = '';
  
  try {
    await updateProfile({
      name: profileForm.value.name,
      email: profileForm.value.email
    });
    profileSuccess.value = 'Perfil atualizado com sucesso!';
    
    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      profileSuccess.value = '';
    }, 3000);
  } catch (err) {
    profileError.value = err.message;
  }
};

const handlePasswordChange = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  
  try {
    await changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    );
    passwordSuccess.value = 'Senha alterada com sucesso!';
    
    // Limpar formulário
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
    
    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      passwordSuccess.value = '';
    }, 3000);
  } catch (err) {
    passwordError.value = err.message;
  }
};

const handleLogout = () => {
  logout();
  emit('close');
};

// Lifecycle
onMounted(() => {
  // Preencher formulário com dados atuais do usuário
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      email: user.value.email || ''
    };
  }
});
</script>

<style scoped>
.profile-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
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

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.user-info h2 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.user-email {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-secondary);
}

.user-role {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
}

.user-role.admin {
  background: #fef3c7;
  color: #92400e;
}

.user-role.user {
  background: #dbeafe;
  color: #1e40af;
}

.profile-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;
}

.tab-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tab-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.tab-content {
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

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
}

.error-icon,
.success-icon {
  font-size: 1rem;
}

.update-button {
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

.update-button:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.update-button:disabled {
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

.profile-footer {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.close-button,
.logout-button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.close-button {
  background: var(--secondary-color);
  color: var(--text-primary);
}

.close-button:hover {
  background: var(--border-color);
}

.logout-button {
  background: var(--error-color);
  color: white;
}

.logout-button:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .profile-card {
    padding: var(--spacing-xl);
    margin: var(--spacing-md);
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-footer {
    flex-direction: column;
  }
}
</style> 