import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/lupa_branca.png";
import editIcon from "../../../assets/edicao.png";
import Header from "../../../components/master/header";
import "./style.css";

interface Livro {
  id: number;
  titulo: string;
  autoresFormatados: string;
  editora: string;
  disponivel: boolean;
}

interface LivroDetalhado {
  id: number;
  titulo: string;
  autoresFormatados: string;
  isbn: string;
  numeroChamada: string;
  exemplares: number;
  lingua: string;
  editora: string;
  anoPublicacao: string;
  descricaoFisica: string;
  tituloSerie: string;
  assuntosFormatados: string;
  disponivel: boolean;
  cutter: string;
  edicao: string;
  cdd: string;
  localPublicacao: string;
}

const categories = ["Título", "ISBN"];

function ConsultaLivrosMaster() {
  const navigate = useNavigate();

  const [livros, setLivros] = useState<Livro[]>([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>([]);
  const [termoBusca, setTermoBusca] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("Título");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [livroSelecionado, setLivroSelecionado] = useState<LivroDetalhado | null>(null);

  // Busca livros na API (todos)
  const fetchLivros = async () => {
    try {
      const response = await fetch("http://localhost:8080/livro");
      if (!response.ok) throw new Error("Erro ao buscar livros");
      const data: Livro[] = await response.json();
      setLivros(data);
      setLivrosFiltrados(data);
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  // Busca filtrada por categoria quando o botão é clicado
  const handleSearch = async () => {
    if (!termoBusca.trim()) {
      setLivrosFiltrados(livros);
      return;
    }

    try {
      setIsLoading(true);
      let url = "";

      if (categoria === "ISBN") {
        url = `http://localhost:8080/livro/filtrar?isbn=${termoBusca}`;
      }

      if (categoria === "Título") {
        const termo = termoBusca.toLowerCase();
        const resultados = livros.filter(
          (livro) =>
            livro.titulo.toLowerCase().includes(termo) ||
            livro.editora.toLowerCase().includes(termo)
        );
        setLivrosFiltrados(resultados);
      } else {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro na busca filtrada");
        const data: Livro[] = await response.json();
        setLivrosFiltrados(data);
      }
    } catch (error) {
      console.error("Erro na busca filtrada:", error);
      setLivrosFiltrados([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Redireciona para página de edição
  const handleEdit = (livroId: number) => {
    navigate(`/editarLivro/master/${livroId}`);
  };

  const abrirPopup = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/livro/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar detalhes");

      const data: LivroDetalhado = await response.json();
      setLivroSelecionado(data);
    } catch (error) {
      console.error("Erro ao abrir detalhes:", error);
    }
  };

  return (
    <div className="admin-container">
      <Header />

      <main className="admin-content">
        <h1 className="admin-title">Painel Administrativo</h1>
        <p className="admin-subtitle">
          Gerencie o acervo e empréstimos da biblioteca
        </p>

        <div className="consulta-card-container">
          <div className="consulta-header">
            <h2>Consultar e Editar livros</h2>
            <button className="btn-voltar" onClick={() => navigate('/home/master')}>Voltar</button>
          </div>

          {/* Barra de Busca */}
          <div className="search-bar-container">
            <input
              type="text"
              placeholder={`Buscar por ${categoria.toLowerCase()}...`}
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="search-input"
            />

            <select
              id="category"
              className="filter-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button className="search-button" onClick={handleSearch}>
              <img src={searchIcon} alt="Buscar" />
            </button>
          </div>

          {/* Tabela de Livros */}
          <div className="livros-table-container">
            {isLoading ? (
              <p className="loading-message">Carregando livros...</p>
            ) : livrosFiltrados.length === 0 ? (
              <p className="no-results">Nenhum resultado encontrado.</p>
            ) : (
              <table className="livros-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Editora</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {livrosFiltrados.map((livro) => (
                    <tr
                      key={livro.id}
                      onClick={() => abrirPopup(livro.id)}
                      className="clickable-row"
                    >
                      <td>{livro.titulo}</td>
                      <td>{livro.autoresFormatados}</td>
                      <td>{livro.editora}</td>
                      <td>
                        <span
                          className={`status-tag ${
                            livro.disponivel ? "status-disponivel" : "status-indisponivel"
                          }`}
                        >
                          {livro.disponivel ? "Disponível" : "Indisponível"}
                        </span>
                      </td>
                      <td className="action-cell">
                        <button
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(livro.id);
                          }}
                        >
                          <img src={editIcon} alt="Editar" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {livroSelecionado && (
          <div
            className="modal-overlay"
            onClick={() => setLivroSelecionado(null)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">Detalhes do Livro</h2>

                <button
                  className="modal-close"
                  onClick={() => setLivroSelecionado(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-grid">
                <div><strong>Título</strong><p>{livroSelecionado.titulo}</p></div>
                <div><strong>Autores</strong><p>{livroSelecionado.autoresFormatados}</p></div>
                <div><strong>ISBN</strong><p>{livroSelecionado.isbn}</p></div>
                <div><strong>Número de Chamada</strong><p>{livroSelecionado.numeroChamada}</p></div>
                <div><strong>Número de Registro</strong><p>{livroSelecionado.cutter || "—"}</p></div>
                <div><strong>Língua</strong><p>{livroSelecionado.lingua}</p></div>
                <div><strong>Edição</strong><p>{livroSelecionado.edicao}</p></div>
                <div><strong>Categoria (CDD)</strong><p>{livroSelecionado.cdd}</p></div>
                <div><strong>Local de Publicação</strong><p>{livroSelecionado.localPublicacao}</p></div>
                <div><strong>Ano de Publicação</strong><p>{livroSelecionado.anoPublicacao}</p></div>
                <div><strong>Editora</strong><p>{livroSelecionado.editora}</p></div>
                <div><strong>Descrição Física</strong><p>{livroSelecionado.descricaoFisica}</p></div>
                <div><strong>Título da Série</strong><p>{livroSelecionado.tituloSerie || "—"}</p></div>
                <div><strong>Assuntos</strong><p>{livroSelecionado.assuntosFormatados}</p></div>

                <div>
                  <strong>Status </strong>
                  <span
                    className={`status-tag ${
                      livroSelecionado.disponivel
                        ? "status-disponivel"
                        : "status-indisponivel"
                    }`}
                  >
                    {livroSelecionado.disponivel ? "Disponível" : "Indisponível"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default ConsultaLivrosMaster;
