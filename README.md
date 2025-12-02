# 📚 Sistema de Gerenciamento de Biblioteca – CEDUP Hermann Hering  

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

📌 Trabalho de Conclusão de Curso – Instituto CEDUP Hermann Hering  
📅 Turma de Desenvolvimento de Sistemas (2023 – 2025)  
🖇️ Documentação: [Monografia](https://github.com/user-attachments/files/23834975/_Monografia.do.Sistema.de.Gerenciamento.de.Biblioteca.do.CEDUP.Hermann.Hering.docx.2.2.pdf) \
🖼️ Apresentção: [Slides](https://github.com/user-attachments/files/23880022/Sistema.de.Gerenciamento.de.Biblioteca.do.CEDUP.Hermann.Hering.2.pdf)

---

## 📑 Sumário
- [🎯 Objetivo Geral](#-objetivo-geral)
- [👨‍🏫 Principais Partes Interessadas](#-principais-partes-interessadas)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📡 Endpoints da API](#-endpoints-da-api)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
- [📊 Funcionalidades Principais](#-funcionalidades-principais)

---

## 🎯 Objetivo Geral  
Desenvolver um sistema web para otimizar e facilitar o gerenciamento do acervo de livros da biblioteca do CEDUP Hermann Hering, permitindo:

- Registro eficiente de livros;  
- Controle dos processos de empréstimos e devoluções;  
- Consulta pública do acervo com filtragem avançada;  
- Agilidade e praticidade para bibliotecários e usuários.

---

## 👨‍🏫 Principais Partes Interessadas  

### **Time de Professores / Banca:**  
- Orientador: *Prof. Ricardo Romero Maranhão Castro*  
- Projeto de Software: *Prof. Marcos Rodrigo Momo / Prof. Oscar Steffen Junior*  
- Práticas de Desenvolvimento de Sistemas IV: *Prof. Antônio Carlos Nicolodi*  
- Modelagem de Sistemas UML: *Prof. Wesley Falcao Silva*  
- Treinamento Interpessoal: *Prof. André Ricardo Naatz*

### **Time de Desenvolvimento / Estudantes:**  
- **Andriely Camile Ritzk** – Front-end
- **Camille Eduarda Gonçalves Schluter** – Fullstack  
- **Elisa Amorim Zabel** – Front-end
- **Gabriel Luiz Pissaia** – Back-end

---

## 🛠️ Tecnologias Utilizadas  
- **Back-end:** Java + Spring Boot  
- **Front-end:** React + TypeScript  
- **Banco de Dados:** MySQL  
- **Ferramentas de Teste:** Postman  
- **Controle de Versão:** Git/GitHub  

---

## 📡 Endpoints da API  

### 📘 **Livros**
| Método | Endpoint | Descrição |
|-------|----------|-----------|
| GET | `/livro` | Lista todos os livros |
| POST | `/livro` | Cadastra um novo livro |
| PUT | `/livro/{id}` | Atualiza as informações de um livro |
| DELETE | `/livro/{id}` | Exclui um livro pelo ID |
| GET | `/filtrar?parametro=condicao` | Filtra livros por critérios específicos |

#### Exemplo JSON – **POST /livro**
```json
{
  "isbn": "978-853253078-3",
  "numeroChamada": "PZ7.R7983",
  "exemplares": 1,
  "lingua": "Português",
  "autores": ["J.K. Rowling"],
  "titulo": "Harry Potter e a Pedra Filosofal",
  "edicao": "Edição brasileira",
  "localPublicacao": "Rio de Janeiro",
  "editora": "Editora Rocco",
  "anoPublicacao": 2003,
  "descricaoFisica": "264 páginas, brochura",
  "tituloSerie": "Harry Potter - Livro 1",
  "assuntos": ["Fantasia", "Literatura Infantojuvenil", "Magia"],
  "cutter": "R883h",
  "cdd": "823.914",
  "disponivel": true,
  "assuntosFormatados": "Fantasia; Literatura Infantojuvenil; Magia",
  "autoresFormatados": "J.K. Rowling"
}
