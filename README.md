# 📱 Mobile Script Boys – Museu na Mão

Aplicativo mobile desenvolvido em **React Native (Expo)** que permite ao usuário explorar museus, visualizar detalhes, favoritar locais, acessar fotos e fazer login/registro. O projeto integra dados reais da API **Google Places** para exibir imagens e informações confiáveis sobre museus.

---

## 🚀 Funcionalidades

### 🔐 Autenticação

* Login e cadastro de usuários com validação em tempo real
* Armazenamento seguro dos dados utilizando **SQLite** (via Expo SQLite)
* Manutenção do estado autenticado entre sessões
* Sistema de permissões para câmera e galeria

### 🗺️ Exploração de Museus

* **HomeScreen**: Dashboard principal com carrossel de museus em destaque, categorias e mapa interativo
* **ExploreScreen**: Busca e exploração completa de museus com filtros e paginação
* **MuseumsCategoryScreen**: Visualização por categorias de museus
* Listagem de museus com nome, endereço, rating e fotos
* Fotos geradas automaticamente com **getPlacePhotoUrl()** usando referências do Google Places
* Sistema de busca e filtros por categoria
* Suporte para museus customizados criados pelo usuário

### 🖼️ Tela de Detalhes

* Página completa com informações detalhadas do museu
* Renderização de imagens por meio da função `getPlacePhotoUrl(photoReference, tamanho)`
* Exibição de rating, avaliações, horários de funcionamento e endereço
* Botão de favoritar/desfavoritar integrado
* Status de abertura (aberto/fechado) em tempo real

### ⭐ Favoritos

* Permite adicionar e remover museus favoritos
* Tela dedicada para visualização de favoritos
* Salvamento local usando storage personalizado (`favoritesStorage`)
* Busca e filtros na tela de favoritos

### 👤 Perfil do Usuário

* **ProfileScreen**: Exibe nome, e-mail e foto de perfil
* **EditProfileScreen**: Edição completa do perfil
* Upload de foto de perfil via câmera ou galeria
* Integração com **Expo Image Picker** para seleção de imagens
* Foto carregada automaticamente ao abrir a tela

### ➕ Museus Customizados

* **AddMuseumScreen**: Permite adicionar museus personalizados
* Armazenamento local de museus criados pelo usuário
* Integração com museus da API do Google Places

### 📍 Localização e Mapas

* Integração com **Expo Location** para geolocalização
* Mapa interativo na HomeScreen mostrando museus próximos
* Busca de museus por cidade/seleção de localização
* Armazenamento da localização preferida do usuário

### 📚 Integração Wikipedia

* Busca automática de informações do museu na Wikipedia em português
* Exibição de resumo e link para artigo completo
* Imagens adicionais da Wikipedia quando disponíveis

### ℹ️ Sobre o App

* **AboutScreen**: Informações sobre o aplicativo e equipe de desenvolvimento

---

## 📂 Estrutura do Projeto

```
project/
├── App.js                          # Componente principal e navegação
├── index.js                        # Ponto de entrada da aplicação
├── app.json                        # Configuração do Expo
├── package.json                    # Dependências do projeto
│
├── assets/                         # Recursos visuais
│   ├── adaptive-icon.png
│   ├── icon.png
│   ├── logo-museu.png
│   ├── script-boys-logo.png
│   └── splash-icon.png
│
├── components/                     # Componentes reutilizáveis
│   ├── ButtonPrimary.js           # Botão primário customizado
│   ├── InputField.js              # Campo de input customizado
│   ├── LocationSelector.js        # Seletor de localização
│   ├── MuseumCard.js              # Card horizontal de museu
│   └── MuseumGridCard.js          # Card em grid de museu
│
├── screens/                        # Telas da aplicação
│   ├── AboutScreen.js             # Sobre o aplicativo
│   ├── AddMuseumScreen.js         # Adicionar museu customizado
│   ├── EditProfileScreen.js       # Editar perfil
│   ├── ExploreScreen.js           # Explorar museus
│   ├── FavoritesScreen.js         # Museus favoritos
│   ├── HomeScreen.js              # Tela inicial/dashboard
│   ├── LoginScreen.js             # Tela de login
│   ├── MuseumDetailsScreen.js     # Detalhes do museu
│   ├── MuseumsCategoryScreen.js   # Museus por categoria
│   ├── ProfileScreen.js           # Perfil do usuário
│   └── RegistrationScreen.js      # Cadastro de usuário
│
├── services/                       # Serviços e APIs
│   ├── api.js                     # Serviço de API geral
│   ├── authStorage.js             # Armazenamento de autenticação
│   ├── customMuseumsStorage.js    # Armazenamento de museus customizados
│   ├── favoritesStorage.js        # Armazenamento de favoritos
│   ├── googlePlaces.js            # Integração Google Places API
│   ├── locationStorage.js         # Armazenamento de localização
│   ├── testAPI.js                 # Testes de API
│   ├── userStorage.js             # Armazenamento de usuários
│   └── wikipediaService.js        # Integração Wikipedia API
│
├── database/                       # Banco de dados
│   └── iniciarDatabase.js         # Inicialização SQLite e funções CRUD
│
└── utils/                          # Utilitários
    ├── brazilianCities.js         # Lista de cidades brasileiras
    └── fonts.js                   # Sistema de fontes e paleta de cores
```

---

## 🎨 Design System

### Paleta de Cores

* **Bronze (Primary)**: `#8B6F47` - Cor principal, usada em headers e elementos destacados
* **Amber (Secondary)**: `#C17E3A` - Cor de destaque, usada em botões e acentos
* **Parchment (Background)**: `#F5F0E8` - Cor de fundo principal
* **Moss Green (Success)**: `#4A7C59` - Usado para sucesso, ratings e elementos positivos
* **Terracotta (Error)**: `#A8402E` - Usado para erros e elementos de alerta

### Tipografia

* **Playfair Display** (Serif) - Usada para títulos e textos principais
* **Montserrat** (Sans-serif) - Usada para textos secundários e elementos de UI
* Pesos de fonte disponíveis: 300, 400, 500, 600, 700, 900

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* **React Native** (Expo 54.0.22)
* **React** (19.1.0)
* **JavaScript**

### Navegação

* **@react-navigation/native** (7.1.19)
* **@react-navigation/native-stack** (7.6.2)
* **@react-navigation/bottom-tabs** (7.5.0)
* **@react-navigation/stack** (7.4.8)

### Armazenamento

* **@react-native-async-storage/async-storage** (2.2.0) - Armazenamento assíncrono
* **expo-sqlite** (16.0.9) - Banco de dados SQLite local

### APIs e Serviços Externos

* **Google Places API** - Dados de museus, fotos e informações

### Funcionalidades Nativas

* **expo-location** (~19.0.7) - Geolocalização
* **expo-image-picker** (17.0.8) - Seleção de imagens (câmera/galeria)
* **expo-blur** (15.0.7) - Efeitos de blur
* **react-native-webview** (13.16.0) - Visualização de mapas e conteúdo web

### Outras Bibliotecas

* **react-native-gesture-handler** (~2.28.0) - Gestos e interações
* **react-native-safe-area-context** (5.6.2) - Áreas seguras do dispositivo
* **react-native-screens** (~4.16.0) - Otimização de telas nativas

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/mobile-script-boys.git
cd mobile-script-boys
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a API Key do Google Places

No arquivo `services/googlePlaces.js`, insira sua Google API Key:

```js
const API_KEY = "SUA_GOOGLE_API_KEY";
```

**Nota**: Você precisará ativar as seguintes APIs no Google Cloud Console:
* Places API
* Places API (New)
* Maps JavaScript API (para mapas)

### 4. Inicialize o banco de dados

O banco de dados SQLite será criado automaticamente na primeira execução do aplicativo através do arquivo `database/iniciarDatabase.js`.

### 5. Execute o projeto

```bash
npx expo start
```

### Comandos adicionais

```bash
# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no Web
npm run web
```

---

## ☁️ Serviços Integrados

### 🔸 Google Places API

Usado para:

* Busca de museus próximos por localização
* Fotos de museus (`photoReference`)
* Endereços formatados
* Ratings e avaliações
* Horários de funcionamento
* Informações detalhadas sobre estabelecimentos

### 🔸 Wikipedia API

Usado para:

* Busca de informações complementares sobre museus
* Resumos e descrições
* Imagens adicionais quando disponíveis
* Links para artigos completos

---

## 🗄️ Banco de Dados

O projeto utiliza **SQLite** local para armazenar:

### Tabela `museus`
* Informações de museus
* Dados customizados e da API
* Referências e identificadores únicos

### Tabela `usuarios`
* Dados de usuários cadastrados
* Informações de perfil
* Imagens de perfil (caminhos locais)

O banco é inicializado automaticamente através de `database/iniciarDatabase.js`.

---

## 📱 Telas Principais

### Tela de Login
* Validação em tempo real de email e senha
* Suporte para navegação para cadastro
* Indicadores de carregamento
* Tratamento de erros

### HomeScreen
* Carrossel horizontal de museus em destaque
* Grid de categorias com ícones
* Mapa interativo mostrando museus próximos
* Navegação por abas inferior

### ExploreScreen
* Busca de museus
* Filtros por categoria
* Listagem em grid
* Carregamento paginado
* Sistema de favoritos integrado

### MuseumDetailsScreen
* Informações completas do museu
* Múltiplas fotos
* Integração Wikipedia
* Botão de favoritar
* Status de abertura
* Rating e avaliações

### ProfileScreen
* Exibição do perfil do usuário
* Foto de perfil
* Opções para editar perfil
* Botão de logout

---

## 🔑 Credenciais de Demonstração

Para testar o aplicativo, use as seguintes credenciais:

```
E-mail: admin@museum.com
Senha: museum123
```

---

## 👨‍💻 Desenvolvedores

**Script Boys Team**

