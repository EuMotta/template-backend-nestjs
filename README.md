# 🚀 NestJS Boilerplate

Um boilerplate para construção de APIs com **NestJS**. Para iniciar projetos com uma estrutura pronta e testada.

![GitHub Repo Stars](https://img.shields.io/github/stars/EuMotta/template-backend-nestjs?style=for-the-badge)
![GitHub Forks](https://img.shields.io/github/forks/EuMotta/template-backend-nestjs?style=for-the-badge)
![GitHub Issues](https://img.shields.io/github/issues/EuMotta/template-backend-nestjs?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/EuMotta/template-backend-nestjs?style=for-the-badge)

---

## 📦 Features

- 🔐 **Autenticação JWT** com hash de senha via `bcrypt`
- 👥 Tabela de **usuários**
- 🏠 Tabela de **endereços** com relacionamento a usuários
- 🛡️ **Role Guard** para controle de acesso (admin/user)
- 📄 Documentação automática com Swagger
- 🧱 Estrutura modular e pronta para escalabilidade (DDD-friendly)
- 🧪 Suporte a testes com `Jest` e `Supertest`

---

## ⚙️ Tecnologias e Bibliotecas

- **NestJS 11** (`@nestjs/core`, `@nestjs/common`)
- **Autenticação:** `@nestjs/jwt`, `bcrypt`
- **ORMs:** `@nestjs/typeorm` + `pg` (PostgreSQL), `@nestjs/mongoose` + `mongoose` (MongoDB)
- **Validação:** `class-validator`, `class-transformer`
- **Configuração:** `@nestjs/config`, `dotenv`
- **Containerização:** `Docker`, `docker-compose` para ambiente isolado
- **Documentação:** `@nestjs/swagger`
- **Rate Limiting:** `@nestjs/throttler`
- **Utilitários:** `uuid`, `reflect-metadata`, `rxjs`
- **Dev Tools:** `eslint`, `prettier`, `jest`, `typescript`, `ts-node`, `ts-jest`

---

## 🚀 Getting Started

### Pré-requisitos

- Node.js v23+
- NPM ou Yarn
- Banco de dados PostgreSQL (ou MongoDB, se preferir)

### Instalação

```bash
# Clone o projeto
git clone https://github.com/EuMotta/template-backend-nestjs.git

# Acesse o diretório
cd template-backend-nestjs

# Instale as dependências
npm install
# ou
yarn install
```

### Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Atualize com suas configurações de banco e JWT.

### Rodando o projeto

```bash
npm run start:dev
```

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 📘 Documentação

Acesse `http://localhost:3001/api` para ver a documentação gerada via Swagger.

---

## 🛣️ Roadmap

- [x] Autenticação JWT
- [x] Endpoints de usuários e endereços
- [x] Role Guard (admin/user)
- [x] Swagger
- [ ] Upload de arquivos
- [ ] Internacionalização (i18n)
- [ ] Integração com Docker

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork
2. Crie sua branch: `git checkout -b feature/sua-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/sua-feature`
5. Crie um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.

---

## 📬 Contato

José Antonio Motta – [@linkedin](https://www.linkedin.com/in/jos%C3%A9-antonio-bueno-motta-61006a26b/)

Projeto: [https://github.com/EuMotta/template-backend-nestjs](https://github.com/EuMotta/template-backend-nestjs)
