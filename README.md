<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h2 align="center">Proyecto Base con NestJS + OAuth2</h2>

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

sequenceDiagram
    participant FE as Frontend
    participant Provider as OAuth Provider (Discord/Google)
    participant AuthCtrl as AuthController
    participant Mediator as MediatorService
    participant CmdHandler as OAuth2CommandHandler
    participant DB as Database
    participant JWT as JwtService

    FE->>Provider: GET /oauth2/authorize
    Provider-->>FE: Redirect con code + state
    FE->>AuthCtrl: GET /auth/oauth2/callback?code=XXX

    AuthCtrl->>Mediator: execute(OAuth2Command)
    Mediator->>CmdHandler: dispatch OAuth2Command

    CmdHandler->>Provider: Intercambiar code por token
    Provider-->>CmdHandler: access_token + refresh_token

    CmdHandler->>Provider: Obtener perfil usuario
    Provider-->>CmdHandler: { id, email, username }

    CmdHandler->>DB: Buscar/crear usuario + identidad
    CmdHandler->>JWT: Generar JWT

    CmdHandler-->>AuthCtrl: { user, token }
    AuthCtrl-->>FE: { user, token }
