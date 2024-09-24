import { ExerciseInterface } from "./exercise.interface"
import { StudentInterface } from "./student.interface"
import { TrainingInterface } from "./training.interface"

export interface UserInterface {
    "name": string,
    "email": string,
    "password": string,
    "plan": string,
    "students": StudentInterface[],
    "exercises": ExerciseInterface[],
    "trainings": TrainingInterface[]
}
