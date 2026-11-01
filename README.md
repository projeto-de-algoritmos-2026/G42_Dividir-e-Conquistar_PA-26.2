# G42_grafos_PA26.2

# UrbanRoutingDelivery - Sistema de Roteamento Logístico do DF



**Disciplina:** Projeto de Algoritmos (PA) - Módulo 1 (Grafos)  

**Instituição:** Universidade de Brasília (UnB)  

**Dupla:** Thiago Accioly & Marjorie



---



##  Sobre o Projeto

O **UrbanRoutingDelivery** é um sistema distribuído de roteamento logístico que calcula a menor distância entre pontos de uma malha urbana (baseada no Distrito Federal). O projeto foi desenvolvido para demonstrar a aplicação prática da Teoria dos Grafos utilizando o **Algoritmo de Dijkstra**.



A arquitetura do projeto foi dividida em três camadas distintas para garantir a **separação de responsabilidades (Separation of Concerns)**:

1.  **Core (C++):** Motor matemático de alta performance responsável pela estrutura de dados do grafo e cálculo de rotas.

2.  **API (Node.js):** Camada intermediária de comunicação (`child_process`) que expõe os cálculos matemáticos para o mundo web via JSON.

3.  **Frontend (React/Vite):** Interface gráfica moderna com renderização espacial em SVG para visualização interativa do grafo.



##  Modelagem do Grafo

A estrutura de dados principal implementada em C++ adota os seguintes preceitos acadêmicos:



*   **Grafo Não-Direcionado (Undirected):** As conexões (arestas) representam vias de mão dupla entre os locais. A função `addUndirectedEdge()` garante que o custo de ida é igual ao de volta.

*   **Grafo Ponderado (Weighted):** Cada aresta possui um peso numérico correspondente à distância em quilômetros entre os nós. O Algoritmo de Dijkstra foi escolhido especificamente para buscar o menor caminho através do somatório destes pesos.

*   **Grafo Desconexo (Disconnected):** Intencionalmente, a malha possui um vértice de grau zero (`Deposito Isolado`). Isso foi implementado para testar e validar o tratamento de exceções (Edge Cases) do algoritmo quando uma rota é matematicamente inalcançável. A classe `Router` atua como domínio, traduzindo strings nominais para identificadores (IDs) compreendidos pela matriz do grafo.



##  Como Executar Localmente



**Pré-requisitos:** `CMake`, `g++`, `Node.js` e `npm`.



### 1. Compilando o Core em C++

Abra o terminal na pasta raiz do `UrbanRoutingDelivery` e execute:

\`\`\`bash

cmake -S . -B build

cmake --build build

\`\`\`

*Isso gerará o executável \`urban_router\` dentro da pasta \`build/\`.*



### 2. Rodando a API (Node.js)

Em um terminal, inicie o servidor:

\`\`\`bash

cd api

npm install

npm start

\`\`\`

*O servidor rodará na porta 3000.*



### 3. Rodando o Frontend (React)

Em um **novo** terminal, inicie a interface:

\`\`\`bash

cd frontend

npm install

npm run dev

\`\`\`

*Acesse \`http://localhost:5173\` no seu navegador.*



##  Apresentação em Vídeo

[Insira o link do YouTube aqui após a gravação]