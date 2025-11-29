package com.softwareLibrary.biblioteca.Service;

import com.softwareLibrary.biblioteca.Enums.TipoAcesso;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class AuthService {

    @Value("${bibliotecaria.senha}")
    private String senhaSistema;

    @Value("${master.senha}")
    private String senhaMaster;

    public TipoAcesso authenticate(String senhaDigitada) {

        if (senhaDigitada == null || senhaDigitada.trim().isEmpty()) {
            throw new IllegalArgumentException("Senha não pode estar vazia");
        }

        if (senhaSistema.equals(senhaDigitada)) {
            return TipoAcesso.ADMIN;
        }

        if (senhaMaster.equals(senhaDigitada)) {
            return TipoAcesso.MASTER;
        }

        return null;
    }


    // Opcional
    public void setSenhaSistema(String novaSenha) {
        this.senhaSistema = novaSenha;
    }

    public void setSenhaMaster(String novaSenha){
        this.senhaMaster = novaSenha;
    }

    public boolean validarSenhaAtual(String senhaAtual, TipoAcesso tipo) {
        if (tipo == TipoAcesso.ADMIN) {
            return senhaSistema.equals(senhaAtual);
        } else if (tipo == TipoAcesso.MASTER) {
            return senhaMaster.equals(senhaAtual);
        }
        return false;
    }
}
