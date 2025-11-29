package com.softwareLibrary.biblioteca.Service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.softwareLibrary.biblioteca.Entidade.Emprestimo;
import com.softwareLibrary.biblioteca.Repository.EmprestimoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;


import java.time.LocalDate;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    public byte[] gerarRelatorioUltimos30Dias() {

        LocalDate dataLimite = LocalDate.now().minusDays(30);
        List<Emprestimo> emprestimos = emprestimoRepository.findEmprestimosUltimos30Dias(dataLimite);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font tituloFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph titulo = new Paragraph("Relatório de Empréstimos - Últimos 30 dias", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            titulo.setSpacingAfter(20);
            document.add(titulo);

            PdfPTable tabela = new PdfPTable(6);
            tabela.setWidthPercentage(100);
            tabela.setWidths(new float[]{2f, 2.5f, 2f, 2f, 2f, 2f});

            addHeader(tabela, "ISBN do Livro");
            addHeader(tabela, "Matrícula do Aluno");
            addHeader(tabela, "Data Retirada");
            addHeader(tabela, "Devolução Prevista");
            addHeader(tabela, "Devolução Real");
            addHeader(tabela, "Status");

            for (Emprestimo e : emprestimos) {
                tabela.addCell(createCenterCell(e.getIsbnLivro()));
                tabela.addCell(createCenterCell(e.getMatriculaAluno()));
                tabela.addCell(createCenterCell(e.getDataRetirada().toString()));
                tabela.addCell(createCenterCell(e.getDataDevolucaoPrevista().toString()));
                tabela.addCell(createCenterCell(e.getDataDevolucaoReal() != null ? e.getDataDevolucaoReal().toString() : "—"));
                tabela.addCell(createCenterCell(e.getStatus()));
            }

            document.add(tabela);
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private void addHeader(PdfPTable tabela, String titulo) {
        PdfPCell cell = new PdfPCell(new Phrase(titulo, new Font(Font.HELVETICA, 12, Font.BOLD)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        cell.setPadding(5);
        tabela.addCell(cell);
    }

    private PdfPCell createCenterCell(String content) {
        PdfPCell cell = new PdfPCell(new Phrase(content));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);  // Centraliza horizontalmente
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);    // Centraliza verticalmente
        cell.setPadding(5);
        return cell;
    }


}
