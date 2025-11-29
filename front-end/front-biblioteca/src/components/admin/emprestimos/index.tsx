import { useEffect, useState } from "react";

interface EmprestimoHistorico {
    id: number;
    matriculaAluno: string;
    isbnLivro: string;
    dataRetirada: string;
    dataDevolucaoPrevista: string;
    dataDevolucaoReal: string | null;
    status: string;
}

function HistoricoEmprestimos() {
    const [historico, setHistorico] = useState<EmprestimoHistorico[]>([]);
    const [loadingHistorico, setLoadingHistorico] = useState(true);

    useEffect(() => {
        const fetchHistorico = async () => {
            try {
                const response = await fetch("http://localhost:8080/emprestimos");
                if (!response.ok) throw new Error("Erro ao buscar histórico.");

                const data: EmprestimoHistorico[] = await response.json();

                // pegar os últimos 30
                const ultimos30 = data.slice(-30).reverse();

                setHistorico(ultimos30);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setLoadingHistorico(false);
            }
        };

        fetchHistorico();
    }, []);

    return (
        <div className="historico-container">
            <div className="livros-table-container">
                {loadingHistorico ? (
                    <p className="loading-message">Carregando histórico...</p>
                ) : historico.length === 0 ? (
                    <p className="no-results">Nenhum empréstimo encontrado.</p>
                ) : (
                    <table className="livros-table">
                        <thead>
                            <tr>
                                <th>ISBN Livro</th>
                                <th>Matrícula Aluno</th>
                                <th>Data Retirada</th>
                                <th>Devolução Prevista</th>
                                <th>Devolução Real</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {historico.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.isbnLivro}</td>
                                    <td>{e.matriculaAluno}</td>
                                    <td>{new Date(e.dataRetirada).toLocaleDateString("pt-BR")}</td>
                                    <td>{new Date(e.dataDevolucaoPrevista).toLocaleDateString("pt-BR")}</td>
                                    <td>
                                        {e.dataDevolucaoReal
                                            ? new Date(e.dataDevolucaoReal).toLocaleDateString("pt-BR")
                                            : "-"}
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${e.status.toLowerCase()}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default HistoricoEmprestimos;
