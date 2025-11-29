import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/master/header";
import "./style.css";

interface ApiResponse {
    mensagem: string;
}

function AlteracaoSenhaAdmin() {
    const navigate = useNavigate();

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const MIN_LENGTH = 6;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (novaSenha.length < MIN_LENGTH) {
            setMessage({ type: "error", text: `A nova senha deve ter no mínimo ${MIN_LENGTH} caracteres.` });
            setLoading(false);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setMessage({ type: "error", text: "A senha e a confirmação de senha não coincidem." });
            setLoading(false);
            return;
        }

        try {
            const endpoint = "http://localhost:8080/auth/alterar-senha";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senhaAtual: senhaAtual,
                    novaSenha: novaSenha,
                    tipo: "ADMIN"
                }),
            });

            const data: ApiResponse = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "Senha ADMIN alterada com sucesso! Você será redirecionado em instantes."
                });

                setSenhaAtual("");
                setNovaSenha("");
                setConfirmarSenha("");

                setTimeout(() => navigate("/home/master"), 3000);
            } else {
                setMessage({
                    type: "error",
                    text: data?.mensagem || "Erro ao alterar a senha."
                });
            }
        } catch (error) {
            console.error("Erro ao alterar a senha.", error);
            setMessage({
                type: "error",
                text: "Erro ao alterar a senha."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <Header />
            <main className="admin-content">
                <h1 className="admin-title">Alteração de Senha ADMIN</h1>
                <p className="admin-subtitle">
                    Atualize aqui a senha de acesso da bibliotecária (ADMIN).
                </p>

                <div className="master-password-card">
                    <div className="card-header">
                        <h2>Atualizar Senha</h2>
                        <button className="btn-voltar" onClick={() => navigate(-1)} disabled={loading}>
                            Voltar
                        </button>
                    </div>

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form className="password-form" onSubmit={handleSubmit}>

                        {/* SENHA ATUAL */}
                        <div className="form-group">
                            <label htmlFor="senhaAtual">Senha Atual</label>
                            <input
                                type="password"
                                id="senhaAtual"
                                placeholder="Digite a senha atual"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* NOVA SENHA */}
                        <div className="form-group">
                            <label htmlFor="novaSenha">Nova Senha</label>
                            <input
                                type="password"
                                id="novaSenha"
                                placeholder={`Mínimo ${MIN_LENGTH} caracteres`}
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* CONFIRMAR SENHA */}
                        <div className="form-group">
                            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                id="confirmarSenha"
                                placeholder="Confirme a nova senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn-alterar" disabled={loading}>
                            {loading ? "Alterando..." : "Alterar Senha"}
                        </button>
                    </form>
                </div>

            </main>
        </div>
    );
}

export default AlteracaoSenhaAdmin;
