# Rollout Manager

Sistema de gerenciamento para processos de rollout de notebooks, permitindo o rastreamento completo do ciclo de vida desde a homologação até a entrega e substituição.

## 🚀 Sobre o Projeto

Rollout Manager é uma API RESTful desenvolvida com NestJS e Prisma que gerencia o processo de substituição de notebooks em ambientes corporativos. O sistema rastreia todo o ciclo do dispositivo, desde sua entrada no estoque, passando pela homologação técnica, até a entrega ao funcionário e recolhimento do dispositivo antigo.

## 📋 Funcionalidades

- **Gestão de Notebooks**
  - Cadastro e atualização de informações
  - Consulta por ID, service tag e outros filtros
  - Rastreamento de status (pendente, homologado, entregue, etc.)

- **Movimentações**
  - Registro de todas as movimentações físicas
  - Histórico de mudanças de status
  - Rastreamento por analista responsável

- **Salas**
  - Gerenciamento de localidades
  - Rastreamento da localização física dos equipamentos

- **Relatórios**
  - Exportação para Excel
  - Inventário com filtros avançados

## 🔧 Tecnologias

- **Backend**: NestJS, TypeScript
- **ORM**: Prisma
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Documentação**: Postman Collection

## 📚 Documentação da API

A documentação completa da API está disponível através de uma collection do Postman:

1. Importe o arquivo `postman_collection.json` no Postman
2. A collection inclui todos os endpoints organizados por recursos:
   - Notebooks
   - Movements (Movimentações)
   - Places (Salas)
   - Export (Exportação)
3. Inclui também um fluxo completo de rollout com exemplos práticos de uso

## 🏁 Início Rápido

1. **Clone o repositório**
   ```bash
   git clone https://github.com/yourusername/rollout-manager.git
   cd rollout-manager