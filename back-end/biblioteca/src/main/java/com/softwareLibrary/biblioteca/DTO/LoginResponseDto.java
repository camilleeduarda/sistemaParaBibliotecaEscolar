package com.softwareLibrary.biblioteca.DTO;

public class LoginResponseDto {

    private String mensagem;
    private String tipoAcesso;

    public LoginResponseDto(String mensagem, String tipoAcesso) {
        this.mensagem = mensagem;
        this.tipoAcesso = tipoAcesso;
    }

    public LoginResponseDto(String mensagem){
        this.mensagem = mensagem;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getTipoAcesso() {
        return tipoAcesso;
    }

    public void setTipoAcesso(String tipoAcesso) {
        this.tipoAcesso = tipoAcesso;
    }
}
