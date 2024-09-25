export interface UserDtoInterface {
    name: string,
    email: string,
    password: string,
    plan: string,
    exercises: string[],
    studentsId: string[],
    trainingsId: string[]
}
