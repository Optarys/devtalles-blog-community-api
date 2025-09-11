<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <a href="http://postgresql.org/" target="blank">
    <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="105" alt="Postgres Logo" />
  </a>
</p>

<h2 align="center">API con NestJS + PostgreSQL</h2>

---

## 📑 Índice

1. [Descripción](#-descripción)
2. [Requisitos previos](#-requisitos-previos)
3. [Iniciar el proyecto](#-iniciar-el-proyecto)
4. [Diagramas de arquitectura](#-diagramas-de-arquitectura)
   - [Flujo OAuth2 con Discord/Google](#flujo-oauth2-con-discordgoogle)
5. [Recursos](#-recursos)
6. [Licencia](#-licencia)

---

## 📖 Descripción

Este proyecto utiliza [NestJS](https://nestjs.com) como framework principal para construir un backend modular, escalable y orientado a microservicios.  
Incluye integración con **OAuth2 (Discord y Google)** para autenticación de usuarios, además de CQRS para separación de responsabilidades.

---

## ⚙️ Requisitos previos

Antes de iniciar asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://classic.yarnpkg.com/en/docs/install) o NPM
- Una base de datos (ej. PostgreSQL)

---

## 🚀 Iniciar el proyecto

```bash
# Instalar dependencias
$ yarn install

# Modo desarrollo
$ yarn start:dev

# Producción
$ yarn start:prod

# Pruebas unitarias
$ yarn test
```
---
## 🏗️ Diagramas de arquitectura
### Flujo OAuth2 con Discord/Google
  ```mermaid
  sequenceDiagram
      participant FE as Frontend
      participant Discord as Discord OAuth2
      participant AuthCtrl as AuthController
      participant Mediator as MediatorService
      participant CmdHandler as OAuth2CommandHandler
      participant Strategy as DiscordStrategy
      participant DB as Database
      participant JWT as JwtService
  
      FE->>Discord: GET /oauth2/authorize (client_id, redirect_uri, scope, state)
      Discord-->>FE: Redirect con code + state
      FE->>AuthCtrl: GET /auth/oauth2/callback?code=XXX&state=YYY
  
      AuthCtrl->>Mediator: execute(new OAuth2Command(code, state))
  
      Mediator->>CmdHandler: dispatch OAuth2Command
  
      CmdHandler->>Strategy: exchangeCodeForToken(code)
      Strategy->>Discord: POST /oauth2/token
      Discord-->>Strategy: { access_token, refresh_token }
      
      CmdHandler->>Strategy: getUserProfile(access_token)
      Strategy->>Discord: GET /api/users/@me (Authorization: Bearer token)
      Discord-->>Strategy: { id, email, username }
  
      CmdHandler->>DB: Buscar user_identity (provider=discord, provider_user_id=id)
      alt Usuario NO existe
          CmdHandler->>DB: INSERT User + INSERT UserIdentity
      else Usuario YA existe
          CmdHandler->>DB: UPDATE UserIdentity tokens
      end
  
      CmdHandler->>JWT: Generar JWT con { sub, email, provider }
      JWT-->>CmdHandler: token
  
      CmdHandler-->>Mediator: { user, token }
      Mediator-->>AuthCtrl: { user, token }
      AuthCtrl-->>FE: { user, token }
  ```
