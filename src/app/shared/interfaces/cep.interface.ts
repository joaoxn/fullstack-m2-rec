export type CepResponse = CepSuccessInterface | CepErrorInterface;
export interface CepSuccessInterface {
    logradouro: string;
    complemento: string;
    unidade: string;
    bairro: string;
    localidade: string;
    estado: string;
    regiao: string;
}

export interface CepErrorInterface {
    erro: boolean;
}
