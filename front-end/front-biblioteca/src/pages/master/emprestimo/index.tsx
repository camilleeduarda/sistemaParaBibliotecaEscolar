import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/admin/header";
import HistoricoEmprestimos from "../../../components/admin/emprestimos";
import "./style.css"; // Mantido se o CSS for um arquivo separado

// Payload que será enviado para o endpoint
interface RealizarEmprestimoPayload {
  matriculaAluno: string;
  isbnLivro: string;
  dataRetirada: string;   // YYYY-MM-DD
  dataDevolucaoPrevista: string;
  dataDevolucaoReal: string | null;
  status: string;
}

function formatDateYYYYMMDD(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function RegistrarEmprestimoMaster() {
  const navigate = useNavigate();

  const [isbn, setIsbn] = useState<string>("");
  const [matricula, setMatricula] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Validação simples: isbn e matrícula não vazios
  const validate = () => {
    if (!isbn.trim()) {
      setMessage({ type: "error", text: "Informe o ISBN do livro." });
      return false;
    }
    if (!matricula.trim()) {
      setMessage({ type: "error", text: "Informe a matrícula do aluno." });
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setIsSaving(true);

    // monta datas
    const hoje = new Date();
    const retirada = formatDateYYYYMMDD(hoje);
    const prevista = formatDateYYYYMMDD(addDays(hoje, 14));

    const payload: RealizarEmprestimoPayload = {
      matriculaAluno: matricula.trim(),
      isbnLivro: isbn.trim(),
      dataRetirada: retirada,
      dataDevolucaoPrevista: prevista,
      dataDevolucaoReal: null,
      status: "PENDENTE",
    };

    try {
      const resp = await fetch("http://localhost:8080/emprestimos/realizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        // tenta extrair a mensagem do backend
        let errText = "Erro ao registrar empréstimo.";
        try {
          const errJson = await resp.json();
          if (errJson?.message) errText = errJson.message;
        } catch { /* ignore */ }
        throw new Error(errText);
      }

      setMessage({ type: "success", text: "Empréstimo realizado com sucesso! Redirecionando..." });

      // limpa campos
      setIsbn("");
      setMatricula("");

      setTimeout(() => navigate("/home/master"), 1400);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Erro desconhecido.";
      setMessage({ type: "error", text });
    } finally {
      setIsSaving(false);
    }
  };

  // NOVO: função que chama o endpoint e baixa o PDF
  const emitirRelatorio = async () => {
    try {
      const resp = await fetch("http://localhost:8080/emprestimos/relatorio/ultimos-30-dias", {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      if (!resp.ok) {
        // tenta extrair mensagem do backend (se retornar json)
        let msg = "Erro ao gerar relatório.";
        try {
          const j = await resp.json();
          if (j?.message) msg = j.message;
        } catch { /* sem json */ }
        alert(msg);
        return;
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio-emprestimos-30-dias.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // liberar URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao baixar relatório:", err);
      alert("Erro ao baixar relatório. Veja o console para mais detalhes.");
    }
  };

  return (
    <div className="admin-container">
      <Header />

      <main className="admin-content">
        <h1 className="admin-title">Painel Administrativo</h1>
        <p className="admin-subtitle">Gerencie o acervo e empréstimos da biblioteca</p>

        {/* CARD DO FORMULÁRIO */}
        <div className="card-wrapper">
          <div className="consulta-header">
            <h2>Registrar Empréstimo</h2>
            <button className="btn-voltar" onClick={() => navigate("/home/master")}>Voltar</button>
          </div>

          {message && <div className={`message ${message.type}`}>{message.text}</div>}

          <form onSubmit={handleRegister} className="form-emprestimo">
            <div className="form-group">
              <label htmlFor="isbn">ISBN do Livro *</label>
              <input
                id="isbn"
                type="text"
                placeholder="Ex: 978-853590***-5"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="matriculaAluno">Matrícula do Aluno *</label>
              <input
                id="matriculaAluno"
                type="text"
                placeholder="Ex: 2022003003"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Processando..." : "Registrar Empréstimo"}
              </button>
            </div>
          </form>
        </div>

        <div className="card-wrapper card-table">
          <div className="table-header">
            <h2 className="card-title">Últimos Empréstimos Registrados</h2>
            <button className="btn-relatorio" onClick={emitirRelatorio}>
              Emitir Relatório
            </button>
          </div>
          <HistoricoEmprestimos />
        </div>

      </main>
    </div>
  );
}

export default RegistrarEmprestimoMaster;
