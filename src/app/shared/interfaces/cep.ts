export type CepResponse = CepSuccess | CepError;
export interface CepSuccess {
    logradouro: string;
    complemento: string;
    unidade: string;
    bairro: string;
    localidade: string;
    estado: string;
    regiao: string;
}

export interface CepError {
    erro: boolean;
}
