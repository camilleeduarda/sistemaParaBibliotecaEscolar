import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Importação correta do Header para o layout de admin
import Header from "../../../components/master/header"; 
import "./style.css";

interface Emprestimo {
    id: number;
    matriculaAluno: string;
    isbnLivro: string;
    dataRetirada: string;
    dataDevolucaoPrevista: string;
    status: string; // Ex: "EMPRESTADO", "ATRASADO"
}

function RegistrarDevolucaoMaster() {
    const navigate = useNavigate();
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessingMatricula, setIsProcessingMatricula] = useState<string | null>(null); // Para desabilitar o botão específico
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Buscar empréstimos pendentes e atrasados
    useEffect(() => {
        const fetchEmprestimos = async () => {
            setLoading(true);
            try {
                // Endpoint assumido baseado no seu código
                const response = await fetch("http://localhost:8080/emprestimos/pendentes-atrasados"); 

                if (!response.ok) throw new Error("Erro na requisição.");

                const data = await response.json();
                setEmprestimos(data);
            } catch {
                setMessage({ type: "error", text: "Erro ao carregar empréstimos ativos." });
            } finally {
                setLoading(false);
            }
        };

        fetchEmprestimos();
    }, []);

    // Registrar devolução
    const registrarDevolucao = async (matricula: string) => {
        setIsProcessingMatricula(matricula);
        setMessage(null);

        try {
            const response = await fetch(`http://localhost:8080/emprestimos/devolver/${matricula}`, {
                method: "PUT",
            });

            if (!response.ok) {
                // Tenta ler mensagem de erro do backend se houver
                const errorText = await response.text(); 
                throw new Error(errorText || "Erro desconhecido ao registrar devolução.");
            }

            setMessage({ type: "success", text: `Devolução para a matrícula ${matricula} registrada com sucesso!` });

            // Atualizar lista removendo item devolvido
            setEmprestimos(prev => prev.filter(e => e.matriculaAluno !== matricula));

        } catch (error) {
            console.error("Erro de devolução:", error);
            setMessage({ type: "error", text: (error as Error).message || "Erro ao registrar devolução." });
        } finally {
            setIsProcessingMatricula(null);
        }
    };

    return (
        // 1. Container principal do Admin
        <div className="admin-container">
            <Header /> {/* 2. Renderiza o Header */}

            {/* 3. Conteúdo principal com classes de admin */}
            <main className="admin-content">
                <h1 className="admin-title">Painel Administrativo</h1>
                <p className="admin-subtitle">
                    Gerencie o acervo e empréstimos da biblioteca
                </p>

                <div className="consulta-card-container">
                    <div className="consulta-header">
                        <h2>Registar Devolução</h2>
                        <button className="btn-voltar" onClick={() => navigate("/home/master")}>
                            Voltar
                        </button>
                    </div>

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="livros-table-container">
                        {loading ? (
                            <p className="loading-message">Carregando empréstimos...</p>
                        ) : emprestimos.length === 0 ? (
                            <p className="no-results">Nenhum empréstimo pendente ou atrasado encontrado.</p>
                        ) : (
                            <table className="livros-table"> {/* Usando 'livros-table' para manter a formatação da tabela */}
                                <thead>
                                    <tr>
                                        <th>ISBN Livro</th>
                                        <th>Matrícula Aluno</th>
                                        <th>Data Retirada</th>
                                        <th>Devolução Prevista</th>
                                        <th>Status</th>
                                        <th className="action-header">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emprestimos.map(e => (
                                        <tr key={e.id}>
                                            <td>{e.isbnLivro}</td>
                                            <td>{e.matriculaAluno}</td>
                                            <td>{new Date(e.dataRetirada).toLocaleDateString("pt-BR")}</td>
                                            <td>{new Date(e.dataDevolucaoPrevista).toLocaleDateString("pt-BR")}</td>
                                            <td><span className={`status-badge status-${e.status.toLowerCase()}`}>{e.status}</span></td>
                                            
                                            <td className="action-cell">
                                                <button
                                                    className="btn-devolucao" // Reutiliza o estilo do botão de devolução
                                                    onClick={() => registrarDevolucao(e.matriculaAluno)}
                                                    disabled={isProcessingMatricula === e.matriculaAluno}
                                                >
                                                    {isProcessingMatricula === e.matriculaAluno ? "Processando..." : "Registar Devolução"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RegistrarDevolucaoMaster;