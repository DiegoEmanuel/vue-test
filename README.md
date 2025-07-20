# 👥 UserHub - Aplicação Vue.js Moderna

Uma aplicação moderna e responsiva para gerenciar e visualizar usuários, construída com Vue.js 3 e Vite.

## ✨ Funcionalidades

- **🎨 Design Moderno**: Interface limpa e responsiva com gradientes e animações
- **🔍 Busca Avançada**: Busca por nome, email, empresa ou busca geral
- **📊 Estatísticas**: Dashboard com métricas em tempo real
- **⭐ Sistema de Favoritos**: Marque usuários como favoritos com persistência local
- **📱 Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **🎯 Filtros e Ordenação**: Filtre por categoria e ordene por nome
- **⚡ Performance**: Carregamento otimizado com estados de loading
- **🔄 Persistência**: Favoritos salvos no localStorage

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework progressivo
- **Vite** - Build tool rápida
- **Fetch API** - Cliente HTTP nativo
- **CSS Variables** - Sistema de design consistente
- **Grid & Flexbox** - Layout responsivo
- **LocalStorage** - Persistência de dados

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd vue-front
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎨 Componentes

### Header
- Navegação entre usuários e favoritos
- Contador de favoritos
- Design sticky com backdrop blur

### SearchBar
- Busca em tempo real
- Filtros por categoria
- Ordenação ascendente/descendente
- Tags de filtros ativos

### UserCard
- Informações completas do usuário
- Avatar com iniciais
- Links clicáveis (email, telefone, website)
- Botões de ação (favoritar, ver detalhes, posts)

### StatsCard
- Dashboard com métricas
- Total de usuários
- Contagem de favoritos
- Resultados filtrados
- Empresas únicas

### LoadingSpinner
- Animação de carregamento
- Mensagens customizáveis

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Grid adaptativo
- **Mobile**: Layout em coluna única com navegação otimizada

## 🎯 Funcionalidades Principais

### Sistema de Busca
- Busca em tempo real
- Filtros específicos (nome, email, empresa)
- Ordenação alfabética
- Limpeza de filtros

### Sistema de Favoritos
- Marcar/desmarcar usuários
- Persistência no localStorage
- Visualização separada de favoritos
- Contador no header

### Estados da Aplicação
- Loading com spinner animado
- Tratamento de erros
- Estado vazio com call-to-action
- Feedback visual para ações

## 🔧 Estrutura do Projeto

```
vue-front/
├── src/
│   ├── components/
│   │   ├── Header.vue
│   │   ├── SearchBar.vue
│   │   ├── UserCard.vue
│   │   ├── LoadingSpinner.vue
│   │   └── StatsCard.vue
│   ├── views/
│   │   └── HomeView.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── package.json
└── README.md
```

## 🎨 Sistema de Design

### Cores
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #f8fafc (Gray 50)
- **Text Primary**: #1e293b (Slate 800)
- **Text Secondary**: #64748b (Slate 500)

### Espaçamentos
- Sistema de espaçamento consistente (xs, sm, md, lg, xl, 2xl)
- Variáveis CSS para manutenibilidade

### Animações
- Transições suaves (0.15s, 0.3s)
- Hover effects
- Loading animations
- Fade-in effects

## 🚀 Deploy

Para fazer deploy da aplicação:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido para estudo e prática de Vue.js 3.

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
