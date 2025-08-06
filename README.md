# 🥊 Rinha de Backend - NestJS

Este projeto é uma API de alta performance desenvolvida com [NestJS](https://nestjs.com/) para a competição [Rinha de Backend](https://github.com/arenatest/rinha-de-backend). A aplicação foi pensada para escalar bem sob carga, utilizando balanceamento, processamento assíncrono e banco de dados relacional.

<p align="center">
  <img src="./img/architecture.jpeg" alt="Diagrama de Arquitetura" width="600">
</p>

---

## 🚀 Tecnologias Utilizadas

- **NestJS** – Framework em TypeScript para construir APIs escaláveis e modulares.
- **PostgreSQL** – Banco de dados relacional usado para armazenar clientes e transações.
- **Nginx** – Atua como balanceador de carga entre múltiplas instâncias da API.
- **BullMQ** – Gerencia filas de tarefas assíncronas, ideal para operações como logging e auditoria.

---

---

## ▶️ Como Executar

```bash
git clone https://github.com/vitortvale/rinha-de-backend-nestjs.git
docker compose up --build
