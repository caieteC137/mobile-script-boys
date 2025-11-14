# 📱 Mobile Script Boys – Museu na Mão

Aplicativo mobile desenvolvido em **React Native (Expo)** que permite ao usuário explorar museus, visualizar detalhes, favoritar locais, acessar fotos e fazer login/registro. O projeto integra dados reais da API **Google Places** para exibir imagens e informações confiáveis.

---

## 🚀 Funcionalidades

### 🔐 Autenticação

* Login e cadastro de usuários.
* Armazenamento seguro dos dados utilizando `AsyncStorage`.
* Manutenção do estado autenticado.

### 🗺️ Exploração de Museus

* Listagem de museus com:

  * Nome
  * Endereço
  * Foto gerada automaticamente com **getPlacePhotoUrl()** usando referências do Google Places.
* Sistema atualizado recentemente para remover URLs hardcoded.

### 🖼️ Tela de Detalhes

* Página completa com nome, fotos, avaliações e demais informações.
* Renderização de imagens por meio da função `getPlacePhotoUrl(photoReference, tamanho)`.

### ⭐ Favoritos

* Permite adicionar e remover museus favoritos.
* Salvamento local usando storage personalizado.

### 👤 Perfil do Usuário

* Exibe nome, e-mail e foto de perfil.
* Foto é carregada automaticamente ao abrir a tela graças à inicialização:
  `setProfileImage(currentUser?.profileImage || null)`.

---

## 📂 Estrutura do Projeto

```
project/
├── App.js
├── index.js
├── assets/
├── components/
│   ├── MuseumCard.js
│   ├── MuseumGridCard.js
│   └── ... 
├── screens/
│   ├── ExploreScreen.js
│   ├── HomeScreen.js
│   ├── LoginScreen.js
│   ├── MuseumDetailsScreen.js
│   ├── ProfileScreen.js
│   └── RegistrationScreen.js
├── services/
│   ├── api.js
│   ├── authStorage.js
│   ├── googlePlaces.js
│   ├── locationStorage.js
│   └── userStorage.js
├── utils/
│   ├── brazilianCities.js
│   └── fonts.js
└── package.json
```

---

## 🛠️ Tecnologias Utilizadas

* **React Native** (Expo)
* **JavaScript**
* **Google Places API**
* **AsyncStorage** para armazenamento local
* **React Navigation**
* **Expo Location** para geolocalização
* **Fetch API / Axios** para comunicação com backend

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

### 4. Execute o projeto

```bash
npx expo start
```

---

## ☁️ Serviços Integrados

### 🔸 Google Places

Usado para:

* Fotos de museus (`photoReference`)
* Endereços
* Rating
* Informações gerais

### Função principal usada:

```js
getPlacePhotoUrl(photoReference, tamanho)
```

---

## 📝 Atualizações Recentes no Projeto

✔ Remoção de URLs de imagens com chave hardcoded
✔ Substituição por `getPlacePhotoUrl()` em:

* ExploreScreen.js
* MuseumDetailsScreen.js

✔ Ajuste de carregamento automático da foto de perfil
✔ Melhorias na organização de componentes e serviços

---

## 👨‍💻 Desenvolvedores

**Script Boys Team**

