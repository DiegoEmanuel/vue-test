import { ref, computed } from 'vue';

// Estado reativo para o usuário autenticado
const user = ref(null);
const isAuthenticated = ref(false);
const loading = ref(false);

// Simular um banco de dados de usuários (em produção, isso seria uma API)
const users = ref([
  {
    id: 1,
    email: 'admin@userhub.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@userhub.com',
    password: 'user123',
    name: 'Usuário Padrão',
    role: 'user'
  }
]);

// Computed properties
const currentUser = computed(() => user.value);
const authLoading = computed(() => loading.value);
const isAdmin = computed(() => user.value?.role === 'admin');

// Função para simular delay de API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função de login
const login = async (email, password) => {
  loading.value = true;
  
  try {
    // Simular delay de API
    await delay(1000);
    
    // Buscar usuário
    const foundUser = users.value.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Email ou senha incorretos');
    }
    
    // Remover senha do objeto do usuário
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Definir usuário como autenticado
    user.value = userWithoutPassword;
    isAuthenticated.value = true;
    
    // Salvar no localStorage
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('auth_token', 'fake-jwt-token-' + Date.now());
    
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

// Função de registro
const register = async (name, email, password, confirmPassword) => {
  loading.value = true;
  
  try {
    // Simular delay de API
    await delay(1000);
    
    // Validações
    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem');
    }
    
    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
    
    // Verificar se o email já existe
    const existingUser = users.value.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('Este email já está em uso');
    }
    
    // Criar novo usuário
    const newUser = {
      id: users.value.length + 1,
      name,
      email: email.toLowerCase(),
      password,
      role: 'user'
    };
    
    // Adicionar à lista de usuários
    users.value.push(newUser);
    
    // Fazer login automaticamente
    const { password: _, ...userWithoutPassword } = newUser;
    user.value = userWithoutPassword;
    isAuthenticated.value = true;
    
    // Salvar no localStorage
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('auth_token', 'fake-jwt-token-' + Date.now());
    
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

// Função de logout
const logout = () => {
  user.value = null;
  isAuthenticated.value = false;
  
  // Limpar localStorage
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
};

// Função para verificar autenticação no carregamento da página
const checkAuth = () => {
  try {
    const savedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    
    if (savedUser && token) {
      user.value = JSON.parse(savedUser);
      isAuthenticated.value = true;
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    logout();
  }
};

// Função para atualizar perfil do usuário
const updateProfile = async (updates) => {
  loading.value = true;
  
  try {
    await delay(500);
    
    // Atualizar dados do usuário
    user.value = { ...user.value, ...updates };
    
    // Atualizar no localStorage
    localStorage.setItem('auth_user', JSON.stringify(user.value));
    
    return { success: true, user: user.value };
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

// Função para alterar senha
const changePassword = async (currentPassword, newPassword) => {
  loading.value = true;
  
  try {
    await delay(500);
    
    // Verificar senha atual
    const currentUser = users.value.find(u => u.id === user.value.id);
    if (currentUser.password !== currentPassword) {
      throw new Error('Senha atual incorreta');
    }
    
    // Atualizar senha
    currentUser.password = newPassword;
    
    return { success: true };
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};

export function useAuth() {
  return {
    // Estado
    user: currentUser,
    isAuthenticated,
    loading: authLoading,
    isAdmin,
    
    // Métodos
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword
  };
} 