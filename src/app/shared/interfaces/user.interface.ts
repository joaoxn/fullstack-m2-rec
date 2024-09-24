import { StudentInterface } from "./student.interface"
import { TrainingInterface } from "./training.interface"

export interface UserInterface {
    id: number,
    name: string,
    email: string,
    password: string,
    plan: string,
    students?: StudentInterface[],
    exercises?: string[],
    trainings?: TrainingInterface[]
}
