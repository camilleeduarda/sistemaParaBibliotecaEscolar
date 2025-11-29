package com.softwareLibrary.biblioteca.Entidade;


import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_emprestimos")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "matricula_aluno", nullable = false, length = 10)
    private String matriculaAluno;

    @Column(name = "isbn_livro", nullable = false, length = 17)
    private String isbnLivro;

    @Column(name = "data_retirada", nullable = false)
    private LocalDate dataRetirada;

    @Column(name = "data_devolucao_prevista", nullable = false)
    private LocalDate dataDevolucaoPrevista;

    @Column(name = "data_devolucao_real")
    private LocalDate dataDevolucaoReal;

    @Column(name = "status", length = 20)
    private String status; // PENDENTE, DEVOLVIDO, ATRASADO

    // Construtores
    public Emprestimo() {
    }

    public Emprestimo(String matriculaAluno, String isbnLivro) {
        this.matriculaAluno = matriculaAluno;
        this.isbnLivro = isbnLivro;
        this.dataRetirada = LocalDate.now();
        this.dataDevolucaoPrevista = LocalDate.now().plusDays(14);
        this.status = "PENDENTE";
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatriculaAluno() {
        return matriculaAluno;
    }

    public void setMatriculaAluno(String matriculaAluno) {
        this.matriculaAluno = matriculaAluno;
    }

    public String getIsbnLivro() {
        return isbnLivro;
    }

    public void setIsbnLivro(String isbnLivro) {
        this.isbnLivro = isbnLivro;
    }

    public LocalDate getDataRetirada() {
        return dataRetirada;
    }

    public void setDataRetirada(LocalDate dataRetirada) {
        this.dataRetirada = dataRetirada;
    }

    public LocalDate getDataDevolucaoPrevista() {
        return dataDevolucaoPrevista;
    }

    public void setDataDevolucaoPrevista(LocalDate dataDevolucaoPrevista) {
        this.dataDevolucaoPrevista = dataDevolucaoPrevista;
    }

    public LocalDate getDataDevolucaoReal() {
        return dataDevolucaoReal;
    }

    public void setDataDevolucaoReal(LocalDate dataDevolucaoReal) {
        this.dataDevolucaoReal = dataDevolucaoReal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Métodos auxiliares
    public boolean isAtrasado() {
        return LocalDate.now().isAfter(dataDevolucaoPrevista) && dataDevolucaoReal == null;
    }

    public boolean isPendente() {
        return "PENDENTE".equals(status);
    }

    public void devolver() {
        this.dataDevolucaoReal = LocalDate.now();
        this.status = "DEVOLVIDO";
    }

    @Override
    public String toString() {
        return "Emprestimo{" +
                "id=" + id +
                ", matriculaAluno='" + matriculaAluno + '\'' +
                ", isbnLivro='" + isbnLivro + '\'' +
                ", dataRetirada=" + dataRetirada +
                ", dataDevolucaoPrevista=" + dataDevolucaoPrevista +
                ", status='" + status + '\'' +
                '}';
    }
}