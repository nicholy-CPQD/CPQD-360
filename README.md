# CPQD 360

## Sobre o projeto

O **CPQD 360** é uma plataforma web interativa desenvolvida para proporcionar uma experiência de navegação e descoberta pelo campus do CPQD.

A plataforma tem como eixo principal o **Mapa Interativo**, permitindo que o usuário explore diferentes pontos do campus e encontre informações sobre **Serviços & Amenities** e **Eventos**.

### Principais áreas da plataforma

- 🗺️ **Mapa Interativo** — exploração dos pontos e locais do campus.
- 🏪 **Serviços & Amenities** — consulta aos serviços e comodidades disponíveis.
- 📅 **Eventos** — visualização e organização dos eventos do campus.
- 💡 **Compartilhar Ideias** — espaço para envio de sugestões e contribuições dos usuários.

## Objetivo

O objetivo do projeto é centralizar, em uma única experiência digital, informações que auxiliem o usuário a **explorar o campus, localizar serviços e acompanhar eventos**, utilizando uma interface interativa e de fácil navegação.

---

## Estrutura do projeto

A estrutura principal do projeto está organizada da seguinte forma:

| Arquivo/Pasta | Descrição |
|---|---|
| `index.html` | Página inicial da plataforma. |
| `eventos.html` | Página destinada à área de Eventos. |
| `servicos.html` | Página de Serviços & Amenities. |
| `formulario.html` | Formulário para envio de ideias e sugestões. |
| `admin.html` | Interface administrativa do projeto. |
| `painel-admin.html` | Painel administrativo para gerenciamento das informações. |
| `script.js` | Arquivo responsável pelas principais lógicas e interações da aplicação. |
| `style.css` | Arquivo principal de estilos visuais da aplicação. |
| `img/` | Diretório destinado aos recursos de imagem utilizados no projeto. |

---

## Funcionalidades principais

### 🗺️ Mapa Interativo

O Mapa Interativo é o principal eixo de navegação da plataforma.

A área permite a exploração dos pontos do campus e a localização de diferentes espaços e informações relacionadas ao CPQD.

### 🏪 Serviços & Amenities

Área destinada à consulta dos serviços e comodidades disponíveis no campus.

Quando aplicável, os serviços devem possuir integração com o Mapa Interativo, permitindo que o usuário visualize sua localização.

### 📅 Eventos

Área destinada à apresentação dos eventos do campus.

A seção de Eventos faz parte da navegação principal da plataforma e contempla a organização dos eventos em calendário.

### 💡 Compartilhar Ideias

Área destinada ao envio de ideias e sugestões dos usuários.

Essa funcionalidade possui uma posição secundária na hierarquia da interface e está disponível por meio do rodapé da plataforma.

### 🔐 Área administrativa

O projeto também possui páginas destinadas ao gerenciamento administrativo das informações da plataforma.

---

## Organização do desenvolvimento

O desenvolvimento do projeto utiliza **Git** para controle de versão e organização do trabalho em equipe.

A branch `main` representa a versão principal e estável do projeto. Alterações devem entrar na `main` somente após revisão e validação.

Novas funcionalidades e correções devem ser desenvolvidas em branches específicas, evitando alterações diretas na `main`.

### Principais tipos de branches

- `feature/` — desenvolvimento de uma nova funcionalidade.
- `fix/` — correção de um problema existente.
- `refactor/` — melhoria ou reorganização do código sem alteração da funcionalidade.
- `docs/` — alterações exclusivamente relacionadas à documentação.

### Exemplos

```text
feature/eventos
feature/mapa
feature/servicos
fix/filtro-mapa
fix/navegacao
docs/readme