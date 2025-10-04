# Stark VIP API

API backend para verificação de provas ZK no Starknet. Esta API recebe dados de prova do frontend e os envia para o contrato inteligente na rede Starknet Sepolia.

## 🚀 Funcionalidades

- **Verificação de Provas ZK**: Recebe dados de prova do frontend e verifica no contrato Starknet
- **Suporte a Múltiplos Formatos**: Aceita dados em Uint8Array ou base64
- **Integração com Starknet**: Conecta diretamente com contratos na rede Sepolia
- **Validação de Dados**: Valida dados recebidos antes do processamento
- **Logs Detalhados**: Sistema de logging para debugging

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Acesso à rede Starknet Sepolia
- Endereço do contrato deployado

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
cd api
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Editar arquivo .env:**
```env
PORT=3001
NODE_ENV=development
STARKNET_RPC_URL=https://starknet-sepolia.infura.io/v3/YOUR_INFURA_KEY
STARKNET_CHAIN_ID=0x534e5f5345504f4c4941
CONTRACT_ADDRESS=0x_YOUR_CONTRACT_ADDRESS_HERE
```

## 🚀 Execução

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

A API estará disponível em `http://localhost:3001`

## 📡 Endpoints

### Health Check
```
GET /api/health
```
Retorna status da API e serviços.

### Verificação de Prova
```
POST /api/verify
```
Verifica uma prova ZK no contrato Starknet.

**Body (JSON):**
```json
{
  "proof": [14592, 0, 1, ...], // Uint8Array como array
  "publicInputs": [], // Array de inputs públicos
  "verificationKey": [1764, 0, 1, ...] // Uint8Array como array
}
```

### Verificação de Prova (Base64)
```
POST /api/verify/base64
```
Verifica uma prova ZK usando dados em base64.

**Body (JSON):**
```json
{
  "proofB64": "base64_encoded_proof",
  "publicInputs": [],
  "verificationKeyB64": "base64_encoded_verification_key"
}
```

### Informações do Contrato
```
GET /api/verify/contract-info
```
Retorna informações sobre o contrato configurado.

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `PORT` | Porta do servidor | Não (padrão: 3001) |
| `NODE_ENV` | Ambiente de execução | Não (padrão: development) |
| `STARKNET_RPC_URL` | URL do RPC do Starknet | Sim |
| `STARKNET_CHAIN_ID` | ID da rede Starknet | Não (padrão: Sepolia) |
| `CONTRACT_ADDRESS` | Endereço do contrato | Sim |

### CORS

A API está configurada para aceitar requisições de:
- `http://localhost:3000` (desenvolvimento)
- `http://localhost:5173` (Vite dev server)
- Domínios configurados em produção

## 📊 Estrutura de Dados

### Dados de Entrada

A API recebe os seguintes dados do frontend:

- **Proof**: Uint8Array de 14.592 bytes
- **Public Inputs**: Array vazio (conforme imagem)
- **Verification Key**: Uint8Array de 1.764 bytes

### Processamento

1. **Validação**: Verifica se os dados estão no formato correto
2. **Conversão**: Converte Uint8Array para felt252 (formato Starknet)
3. **Chamada do Contrato**: Envia dados para `verify_ultra_starknet_zk_honk_proof`
4. **Resposta**: Retorna resultado da verificação

## 🔍 Logs

A API gera logs detalhados para debugging:

```
2024-01-01T12:00:00.000Z - POST /api/verify
📥 Recebendo dados de verificação: { hasProof: true, ... }
🔄 Preparando dados da prova: { proofLength: 14592, ... }
🚀 Iniciando verificação ZK no Starknet...
✅ Conectado com o contrato: 0x...
🔄 Chamando função do contrato...
✅ Prova verificada com sucesso!
```

## 🐛 Troubleshooting

### Erro: "Contrato não encontrado"
- Verifique se `CONTRACT_ADDRESS` está correto
- Confirme se o contrato foi deployado na rede Sepolia

### Erro: "Falha na conexão com a rede Starknet"
- Verifique se `STARKNET_RPC_URL` está correto
- Teste a conectividade com a rede

### Erro: "Dados inválidos"
- Verifique se os dados estão no formato correto
- Confirme se proof e verificationKey não estão vazios

## 📝 Exemplo de Uso

```javascript
// Frontend (React)
const response = await fetch('http://localhost:3001/api/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    proof: Array.from(proof), // Converter Uint8Array para array
    publicInputs: [],
    verificationKey: Array.from(verificationKey)
  })
});

const result = await response.json();
console.log('Resultado:', result);
```

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração restritiva
- **Validação**: Validação rigorosa de dados
- **Rate Limiting**: (Implementar se necessário)

## 📈 Monitoramento

- Health check endpoint para monitoramento
- Logs estruturados para análise
- Tratamento de erros detalhado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
