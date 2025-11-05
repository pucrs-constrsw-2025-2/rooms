# Guia de Uso do Swagger - Rooms API

## 🚀 Como Acessar

- **Swagger UI**: http://localhost:8188/api/v1/docs
- **OAuth Swagger**: http://localhost:8180/docs

## 🔐 Como Autenticar no Swagger

### Passo 1: Obter o Token de Acesso

Existem duas formas de obter o token:

#### Opção A: Usando o Swagger do OAuth (Recomendado)
1. Acesse http://localhost:8180/docs
2. Localize o endpoint `POST /login`
3. Clique em "Try it out"
4. Preencha os campos:
   - **username**: `admin@pucrs.br`
   - **password**: `a12345678`
5. Clique em "Execute"
6. Copie o valor de `access_token` da resposta

#### Opção B: Usando curl ou Postman
```bash
curl -X POST "http://localhost:8180/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@pucrs.br&password=a12345678"
```

### Passo 2: Configurar a Autenticação no Swagger

1. Acesse http://localhost:8188/api/v1/docs
2. Clique no botão **"Authorize"** 🔒 (canto superior direito)
3. Cole o token no campo que aparecer (apenas o token, SEM "Bearer")
4. Clique em **"Authorize"**
5. Feche o modal

### Passo 3: Testar os Endpoints

Agora você pode:
1. Escolher qualquer endpoint (ex: `GET /api/v1/rooms`)
2. Clicar em "Try it out"
3. Preencher os parâmetros necessários
4. Clicar em "Execute"

O token será automaticamente enviado no header `Authorization: Bearer <token>` em todas as requisições!

## ⚠️ Problemas Comuns

### Token inválido ou expirado
- **Solução**: Gere um novo token seguindo o Passo 1 novamente
- Os tokens JWT têm tempo de expiração

### Erro 401 Unauthorized
- **Causa**: Token não foi configurado ou está inválido
- **Solução**: 
  1. Verifique se clicou em "Authorize" e configurou o token
  2. Gere um novo token se o atual expirou
  3. Certifique-se de que o serviço OAuth está rodando (`docker ps`)

### Endpoints não aparecem
- **Solução**: Limpe o cache do navegador e recarregue a página

## 📝 Notas

- O token precisa ser renovado quando expirar
- Use o endpoint `/refresh` do OAuth para renovar sem fazer novo login
- O Swagger salva o token na sessão do navegador (enquanto a aba estiver aberta)
