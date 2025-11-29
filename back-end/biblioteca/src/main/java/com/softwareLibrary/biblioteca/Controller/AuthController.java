package com.softwareLibrary.biblioteca.Controller;

import com.softwareLibrary.biblioteca.DTO.*;
import com.softwareLibrary.biblioteca.Entidade.Aluno;
import com.softwareLibrary.biblioteca.Enums.TipoAcesso;
import com.softwareLibrary.biblioteca.Service.AlunoService;
import com.softwareLibrary.biblioteca.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    AlunoService alunoService;

    // Login da bibliotecária (existente)
    @PostMapping("/bibliotecaria")
    public ResponseEntity<?> loginBibliotecaria(@RequestBody LoginRequestDto loginRequest) {
        try {
            TipoAcesso tipo = authService.authenticate(loginRequest.getSenha());

            if (tipo != null) {
                return ResponseEntity.ok().body(
                        new LoginResponseDto(
                                "Login realizado com sucesso",
                                tipo.name()  // ADMIN ou MASTER
                        )
                );
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponseDto("Senha incorreta", null));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponseDto("Erro durante a autenticação: " + e.getMessage(), null));
        }
    }

    // Novo: Autenticação do aluno por matrícula
    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AlunoLoginRequestDto loginRequest) {
        try {
            // Validação básica da matrícula
            if (loginRequest.getMatricula() == null || !loginRequest.getMatricula().matches("\\d{10}")) {
                return ResponseEntity.badRequest()
                        .body(new LoginResponseDto("Matrícula deve conter exatamente 10 dígitos numéricos"));
            }

            Optional<Aluno> aluno = alunoService.buscarPorMatricula(loginRequest.getMatricula());

            if (aluno.isPresent()) {
                Aluno alunoEncontrado = aluno.get();
                return ResponseEntity.ok().body(new AlunoLoginResponseDto(
                        "Aluno autenticado com sucesso",
                        alunoEncontrado.getMatricula(),
                        alunoEncontrado.getNome(),
                        alunoEncontrado.getTurma()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponseDto("Matrícula não encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponseDto("Erro durante a autenticação: " + e.getMessage()));
        }

    }

    @PostMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaRequestDto dto) {
        try {
            if (dto.getTipo() == null || dto.getNovaSenha() == null || dto.getSenhaAtual() == null) {
                return ResponseEntity.badRequest().body("Todos os campos são obrigatórios.");
            }

            TipoAcesso tipo;
            try {
                tipo = TipoAcesso.valueOf(dto.getTipo().toUpperCase());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Tipo inválido. Use ADMIN ou MASTER.");
            }

            // Validar senha atual
            if (!authService.validarSenhaAtual(dto.getSenhaAtual(), tipo)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Senha atual incorreta.");
            }

            // Trocar senha
            if (tipo == TipoAcesso.ADMIN) {
                authService.setSenhaSistema(dto.getNovaSenha());
            } else {
                authService.setSenhaMaster(dto.getNovaSenha());
            }

            return ResponseEntity.ok().body(
                    new LoginResponseDto("Senha alterada com sucesso")
            );


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao alterar senha: " + e.getMessage());
        }
    }



}