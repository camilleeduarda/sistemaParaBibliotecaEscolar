import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/master/header";
import "./style.css";

interface Livro {
    id: number;
    isbn: string;
    numeroChamada: string;
    exemplares: number;
    lingua: string;
    autores: string[];
    titulo: string;
    edicao: string;
    localPublicacao: string;
    editora: string;
    anoPublicacao: number;
    descricaoFisica: string;
    tituloSerie: string | null;
    assuntos: string[];
    cutter: string;
    cdd: string;
    disponivel: boolean;
    autoresFormatados: string;
    assuntosFormatados: string;
}

function EditarLivroMaster() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [livro, setLivro] = useState<Livro | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formState, setFormState] = useState({
        isbn: "",
        numeroChamada: "",
        exemplares: 0,
        lingua: "",
        autores: [] as string[],
        titulo: "",
        edicao: "",
        localPublicacao: "",
        editora: "",
        anoPublicacao: 0,
        descricaoFisica: "",
        tituloSerie: "",
        assuntos: [] as string[],
        cutter: "",
        cdd: "",
    });

    // =====================================================
    // CARREGAR DADOS DO LIVRO
    // =====================================================
    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            setMessage({ type: "error", text: "ID do livro não fornecido." });
            return;
        }

        const fetchLivro = async () => {
            try {
                const response = await fetch(`http://localhost:8080/livro/${id}`);
                if (!response.ok) throw new Error("Erro ao buscar o livro");

                const data: Livro = await response.json();
                setLivro(data);

                setFormState({
                    isbn: data.isbn,
                    numeroChamada: data.numeroChamada,
                    exemplares: data.exemplares,
                    lingua: data.lingua,
                    autores: data.autores ?? [],
                    titulo: data.titulo,
                    edicao: data.edicao,
                    localPublicacao: data.localPublicacao,
                    editora: data.editora,
                    anoPublicacao: data.anoPublicacao,
                    descricaoFisica: data.descricaoFisica,
                    tituloSerie: data.tituloSerie ?? "",
                    assuntos: data.assuntos ?? [],
                    cutter: data.cutter,
                    cdd: data.cdd,
                });

            } catch (error) {
                setMessage({ type: "error", text: "Erro ao carregar os dados." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchLivro();
    }, [id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    // ATUALIZAR LIVRO
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch(`http://localhost:8080/livro/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formState),
            });

            if (!response.ok) throw new Error();

            setMessage({ type: "success", text: "Livro atualizado com sucesso!" });

        } catch {
            setMessage({ type: "error", text: "Erro ao atualizar o livro." });
        } finally {
            setIsSaving(false);
        }
    };

    // DELETAR LIVRO
    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja deletar?")) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch(`http://localhost:8080/livro/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error();

            setMessage({ type: "success", text: "Livro deletado com sucesso." });

            setTimeout(() => navigate("/consulta/master"), 1500);

        } catch {
            setMessage({ type: "error", text: "Erro ao deletar o livro." });
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return <div className="page-container">Carregando...</div>;
    }

    if (!livro) {
        return <div className="page-container">{message?.text ?? "Erro ao carregar"}</div>;
    }

    return (
        // 1. Container principal do Admin
        <div className="admin-container">
            <Header /> {/* 2. Renderiza o Header */}

            {/* 3. Conteúdo principal com classes de admin */}
            <main className="admin-content">
                <h1 className="admin-title">Administração de Acervo</h1>
                <p className="admin-subtitle">
                    Atualize os dados bibliográficos e informações do livro.
                </p>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-header-title">Editar Livro: {livro.titulo}</h2>

                        <button className="btn-voltar" onClick={() => navigate("/consulta/master")}>
                            Voltar
                        </button>
                    </div>

                    {message && <div className={`message ${message.type}`}>{message.text}</div>}

                    <form onSubmit={handleUpdate} className="form-grid">

                        {/* CAMPOS NORMAIS */}
                        <div className="form-group">
                            <label>ISBN *</label>
                            <input name="isbn" value={formState.isbn} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Título *</label>
                            <input name="titulo" value={formState.titulo} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Título da Série</label>
                            <input name="tituloSerie" value={formState.tituloSerie ?? ""} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Edição</label>
                            <input name="edicao" value={formState.edicao} onChange={handleChange} />
                        </div>


                        {/* AUTORES */}
                        <div className="form-group full">
                            <label>Autores *</label>

                            {formState.autores.map((autor, index) => (
                                <div key={`autor-${index}`} className="tag-item">
                                    <input
                                        value={autor}
                                        onChange={(e) => {
                                            const newList = [...formState.autores];
                                            newList[index] = e.target.value;
                                            setFormState(prev => ({ ...prev, autores: newList }));
                                        }}
                                    />

                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() =>
                                            setFormState(prev => ({
                                                ...prev,
                                                autores: prev.autores.filter((_, i) => i !== index),
                                            }))
                                        }
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn-add"
                                onClick={() =>
                                    setFormState(prev => ({
                                        ...prev,
                                        autores: [...prev.autores, ""],
                                    }))
                                }
                            >
                                + Adicionar Autor
                            </button>
                        </div>


                        {/* ASSUNTOS */}
                        <div className="form-group full">
                            <label>Assuntos *</label>

                            {formState.assuntos.map((assunto, index) => (
                                <div key={`assunto-${index}`} className="tag-item">
                                    <input
                                        value={assunto}
                                        onChange={(e) => {
                                            const newList = [...formState.assuntos];
                                            newList[index] = e.target.value;
                                            setFormState(prev => ({ ...prev, assuntos: newList }));
                                        }}
                                    />

                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() =>
                                            setFormState(prev => ({
                                                ...prev,
                                                assuntos: prev.assuntos.filter((_, i) => i !== index),
                                            }))
                                        }
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn-add"
                                onClick={() =>
                                    setFormState(prev => ({
                                        ...prev,
                                        assuntos: [...prev.assuntos, ""],
                                    }))
                                }
                            >
                                + Adicionar Assunto
                            </button>
                        </div>


                        {/* RESTANTE DOS CAMPOS */}
                        <div className="form-group">
                            <label>Número de Chamada</label>
                            <input name="numeroChamada" value={formState.numeroChamada} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Cutter</label>
                            <input name="cutter" value={formState.cutter} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>CDD</label>
                            <input name="cdd" value={formState.cdd} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Editora</label>
                            <input name="editora" value={formState.editora} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Língua</label>
                            <input name="lingua" value={formState.lingua} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Local de Publicação</label>
                            <input name="localPublicacao" value={formState.localPublicacao} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Ano de Publicação</label>
                            <input
                                name="anoPublicacao"
                                type="number" // Adicionando type="number" para consistência
                                value={formState.anoPublicacao}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full">
                            <label>Descrição Física</label>
                            <input name="descricaoFisica" value={formState.descricaoFisica} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Exemplares *</label>
                            <input
                                type="number"
                                min={1}
                                name="exemplares"
                                value={formState.exemplares}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* BOTÕES */}
                        <div className="form-actions full">
                            <button type="button" className="btn-delete" onClick={handleDelete} disabled={isSaving}>
                                {isSaving ? "Deletando..." : "Deletar Livro"}
                            </button>

                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? "Salvando..." : "Atualizar Livro"}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}

export default EditarLivroMaster;
