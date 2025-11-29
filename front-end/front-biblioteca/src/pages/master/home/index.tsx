import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import searchIcon from "../../../assets/lupa.png";
import plusIcon from "../../../assets/mais.png";
import returnIcon from "../../../assets/comente.png";
import checkIcon from "../../../assets/setas.png";
import Header from "../../../components/master/header";
import "./style.css";

function MasterHome() {
    const navigate = useNavigate();

    // Estados para armazenar as contagens
    const [totalLivros, setTotalLivros] = useState<number>(0);
    const [emprestimosAtivos, setEmprestimosAtivos] = useState<number>(0);

    // Buscar dados da API ao carregar a página
    useEffect(() => {
        const fetchLivros = async () => {
            try {
                const response = await fetch("http://localhost:8080/livro");
                if (!response.ok) throw new Error("Erro ao buscar livros");
                const data = await response.json();
                setTotalLivros(data.length);
            } catch (error) {
                console.error("Erro ao carregar livros:", error);
                setTotalLivros(0);
            }
        };

        const fetchEmprestimosAtivos = async () => {
            try {
                const response = await fetch("http://localhost:8080/emprestimos/ativos");
                if (!response.ok) throw new Error("Erro ao buscar empréstimos ativos");
                const data = await response.json();
                setEmprestimosAtivos(data.length);
            } catch (error) {
                console.error("Erro ao carregar empréstimos:", error);
                setEmprestimosAtivos(0);
            }
        };

        // Executa as duas buscas em paralelo
        fetchLivros();
        fetchEmprestimosAtivos();
    }, []);

    return (
        <div className="admin-container">
            <Header />

            <main className="admin-content">
                <h1 className="admin-title">Painel Administrativo</h1>
                <p className="admin-subtitle">
                    Gerencie o acervo e empréstimos da biblioteca
                </p>

                <div className="admin-grid">
                    {/* ---------- LINHA SUPERIOR ---------- */}
                    <div className="admin-row">
                        {/* CONSULTAR LIVROS */}
                        <div
                            className="admin-card"
                            onClick={() => navigate("/consulta/master")}
                        >
                            <div className="admin-card-header">
                                <img src={searchIcon} alt="Consultar Livros" />
                                <h2>Consultar Livros</h2>
                            </div>
                            <p>Buscar e editar livros do acervo</p>
                            <div className="admin-card-info">
                                <strong>
                                    {totalLivros === 0 ? "..." : totalLivros}
                                </strong>
                                <span>livros cadastrados</span>
                            </div>
                        </div>

                        {/* CADASTRAR LIVROS */}
                        <div
                            className="admin-card"
                            onClick={() => navigate("/cadastrarLivro/master")}
                        >
                            <div className="admin-card-header">
                                <img src={plusIcon} alt="Cadastrar Livros" />
                                <h2>Cadastrar Livro</h2>
                            </div>
                            <p>Adicionar novo livro ao acervo</p>
                        </div>
                    </div>

                    {/* ---------- LINHA INFERIOR ---------- */}
                    <div className="admin-row">
                        {/* REGISTRAR EMPRÉSTIMO */}
                        <div
                            className="admin-card"
                            onClick={() => navigate("/emprestimo/master")}
                        >
                            <div className="admin-card-header">
                                <img src={returnIcon} alt="Registrar Empréstimo" />
                                <h2>Registrar Empréstimo</h2>
                            </div>
                            <p>Emprestar livro para aluno</p>
                            <div className="admin-card-info">
                                <strong>
                                    {emprestimosAtivos === 0 ? "..." : emprestimosAtivos}
                                </strong>
                                <span>empréstimos ativos</span>
                            </div>
                        </div>

                        {/* REGISTRAR DEVOLUÇÃO */}
                        <div
                            className="admin-card"
                            onClick={() => navigate("/devolucaoLivro/master")}
                        >
                            <div className="admin-card-header">
                                <img src={checkIcon} alt="Registrar Devolução" />
                                <h2>Registrar Devolução</h2>
                            </div>
                            <p>Processar devoluções de livros</p>
                            <span className="admin-card-footer">
                                Finalize empréstimos em aberto
                            </span>
                        </div>
                    </div>
                </div>
                {/* NOVO LINK ADICIONADO AQUI */}
                <div className="master-link-container">
                    {/* Usamos o componente Link do react-router-dom para navegação */}
                    <Link to="/alteracaosenha/master" className="master-link-btn">
                        Acesso Master
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default MasterHome;
