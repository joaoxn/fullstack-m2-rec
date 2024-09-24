export interface StudentInterface {
    id: number,
    name: string,
    email?: string,
    contact: string,
    birthDate?: string,
    address: {
        cep: string,
        street: string,
        number: number,
        district: string,
        city: string,
        state: string,
        complement?: string
    },
    trainings?: {
        id: number,
        concluded: boolean
    }[]
}
