package com.softwareLibrary.biblioteca.Repository;


import com.softwareLibrary.biblioteca.Entidade.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    // Encontrar empréstimos ativos por matrícula
    List<Emprestimo> findByMatriculaAlunoAndStatus(String matriculaAluno, String status);

    // Encontrar o empre
    List<Emprestimo> findAllByMatriculaAlunoAndStatusNot(String matricula, String status);



    // Verificar se aluno tem empréstimo ativo
    boolean existsByMatriculaAlunoAndStatus(String matriculaAluno, String status);

    // Busca pelos ultimos emprestimos num periodo de 30 dias
    @Query("SELECT e FROM Emprestimo e WHERE e.dataRetirada >= :dataLimite ORDER BY e.dataRetirada DESC")
    List<Emprestimo> findEmprestimosUltimos30Dias(@Param("dataLimite") LocalDate dataLimite);


    // Encontrar todos os empréstimos ativos
    List<Emprestimo> findByStatus(String status);

    List<Emprestimo> findByStatusIn(List<String> status);


    // Histórico de empréstimos por aluno
    List<Emprestimo> findByMatriculaAlunoOrderByDataRetiradaDesc(String matriculaAluno);

    Optional<Emprestimo> findByMatriculaAluno(String matricula);

    // Histórico de empréstimos por livro
    List<Emprestimo> findByIsbnLivroOrderByDataRetiradaDesc(String isbnLivro);

    long countByIsbnLivroAndStatusIn(String isbnLivro, List<String> status);

    boolean existsByMatriculaAlunoAndStatusIn(String matriculaAluno, List<String> status);

}