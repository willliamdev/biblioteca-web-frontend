#!/bin/bash

# Configurações com os dados fornecidos
EMAIL="laragabriely13@outlook.com.br"
NOME="lara gabriely"

echo "=== 1. Gerando a chave SSH para o GitHub ==="
ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/id_ed25519 -N ""

echo -e "\n=== 2. Iniciando o agente SSH em segundo plano ==="
eval "$(ssh-agent -s)"

echo -e "\n=== 3. Adicionando a chave ao agente SSH ==="
ssh-add ~/.ssh/id_ed25519

echo -e "\n=== 4. Sua chave pública (COPIE O TEXTO ABAIXO) ==="
echo "--------------------------------------------------------------------------------"
cat ~/.ssh/id_ed25519.pub
echo "--------------------------------------------------------------------------------"
echo "Copie todo o texto delimitado pelos traços acima."

echo -e "\n=== 5. Testando a conexão com o GitHub ==="
ssh -T git@github.com -o StrictHostKeyChecking=accept-new