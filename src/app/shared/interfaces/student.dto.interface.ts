export interface StudentDtoInterface {
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
        trainingId: string,
        concluded: boolean
    }[]
}
