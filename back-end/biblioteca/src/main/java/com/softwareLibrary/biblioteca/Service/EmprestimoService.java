package com.softwareLibrary.biblioteca.Service;

import com.softwareLibrary.biblioteca.Entidade.Emprestimo;
import com.softwareLibrary.biblioteca.Repository.EmprestimoRepository;
import com.softwareLibrary.biblioteca.Repository.LivroRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmprestimoService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private LivroService livroService;

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private PdfService pdfService;

    public Emprestimo realizarEmprestimo(String matriculaAluno, String isbnLivro) {

        // Verificar se aluno existe
        if (!alunoService.existePorMatricula(matriculaAluno)) {
            throw new RuntimeException("Aluno não encontrado com matrícula: " + matriculaAluno);
        }

        // Verificar se livro existe
        if (livroService.buscarPorIsbn(isbnLivro).isEmpty()) {
            throw new RuntimeException("Livro não encontrado com ISBN: " + isbnLivro);
        }

        // Verificar se aluno já tem empréstimo ativo
        if (emprestimoRepository.existsByMatriculaAlunoAndStatus(matriculaAluno, "PENDENTE")) {
            throw new RuntimeException("Aluno já possui um empréstimo pendente");
        }

        if (emprestimoRepository.existsByMatriculaAlunoAndStatus(matriculaAluno, "ATRASADO")) {
            throw new RuntimeException("Aluno já possui um empréstimo atrasado");
        }

        // Verificar se livro já está emprestado
        if (!livroService.isLivroDisponivel(isbnLivro)) {
            throw new RuntimeException("Livro não disponível ");
        }

        Emprestimo emprestimo = new Emprestimo(matriculaAluno, isbnLivro);
        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo devolverLivro(String matricula) {
        List<Emprestimo> emprestimos = emprestimoRepository.findAllByMatriculaAlunoAndStatusNot(matricula, "DEVOLVIDO");

        if (emprestimos.isEmpty()) {
            throw new RuntimeException("Nenhum empréstimo ativo encontrado");
        }

        if (emprestimos.size() > 1) {
            throw new RuntimeException("Mais de um empréstimo ativo encontrado para esta matrícula");
        }

        Emprestimo emprestimo = emprestimos.get(0);

        emprestimo.devolver();
        return emprestimoRepository.save(emprestimo);
    }

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public List<Emprestimo> listarAtivos() {
        return emprestimoRepository.findByStatus("PENDENTE");
    }

    public List<Emprestimo> listarAtrasados() {
        return emprestimoRepository.findByStatus("ATRASADO");
    }

    public List<Emprestimo> historicoPorAluno(String matriculaAluno) {
        return emprestimoRepository.findByMatriculaAlunoOrderByDataRetiradaDesc(matriculaAluno);
    }

    public List<Emprestimo> historicoPorLivro(String isbnLivro) {
        return emprestimoRepository.findByIsbnLivroOrderByDataRetiradaDesc(isbnLivro);
    }

    public Optional<Emprestimo> buscarPorId(Long id) {
        return emprestimoRepository.findById(id);
    }

    public List<Emprestimo> listarPendentesEAtrasados() {
        return emprestimoRepository.findByStatusIn(
                List.of("PENDENTE", "ATRASADO")
        );
    }

    public byte[] gerarRelatorioPDF() {
        return pdfService.gerarRelatorioUltimos30Dias();
    }

}