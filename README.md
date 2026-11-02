# UrbanRoutingDelivery - Sistema de Roteamento Logístico do DF

**Disciplina:** Projeto de Algoritmos (PA) - Módulo 3 (Dividir e Conquistar)  
**Instituição:** Universidade de Brasília (UnB)  
**Dupla:** Thiago Accioly & Marjorie

---

## 📌 Sobre o Projeto
O **UrbanRoutingDelivery** é um sistema distribuído de roteamento e otimização logística. O projeto evolui a cada módulo da disciplina, acumulando algoritmos para resolver diferentes problemas do mundo real de forma integrada. 

A arquitetura utiliza **Separação de Responsabilidades (Separation of Concerns)**:
1. **Core (C++17):** Motor matemático de alta performance isolado em subpastas por módulo.
2. **API (Node.js):** Camada de integração (`execFile`) que expõe os cálculos matemáticos de forma segura via HTTP/JSON.
3. **Frontend (React/Vite):** Interface gráfica interativa em Tailwind CSS com renderização de mapas em SVG.

## 🧠 Módulos Desenvolvidos

### Módulo 1: Grafos (Dijkstra)
Resolve o problema clássico de deslocamento na malha urbana encontrando a rota de menor distância. Modelado como um **Grafo Não-Direcionado, Ponderado e Desconexo** (para validação de falhas em pontos isolados).

### Módulo 2: Algoritmos Ambiciosos (Interval Scheduling)
Otimiza a agenda do entregador. Utilizando a heurística *Earliest Finish Time First* ordenamos as janelas de entregas por horário de término para maximizar o volume de pacotes entregues em um único turno sem conflito de horários.

### Módulo 3: Dividir e Conquistar (Closest Pair of Points)
Identifica agrupamentos espaciais estratégicos determinando os dois pontos de entrega geograficamente mais próximos em um plano 2D. 
O algoritmo divide o plano recursivamente garantindo complexidade de tempo de **$O(N \log N)$**. Ele ordena os pontos por coordenadas $X$ e $Y$, resolve as metades separadamente e valida uma faixa central (*strip*) limitando as comparações a um máximo de 7 vizinhos, descartando a ineficiência de $O(N^2)$ da força bruta.

## 🚀 Como Executar Localmente

**Pré-requisitos:** `CMake`, `g++`, `Node.js` e `npm`.

### 1. Compilando o Core em C++
Na pasta raiz do repositório, gere o executável:
```bash
cmake -S UrbanRoutingDelivery -B UrbanRoutingDelivery/build
cmake --build UrbanRoutingDelivery/build
