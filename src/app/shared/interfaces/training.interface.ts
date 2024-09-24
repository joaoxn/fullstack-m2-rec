import { ExerciseInterface } from "./exercise.interface";

export interface TrainingInterface {
    "exercise": ExerciseInterface,
    "repetitions": number,
    "weight": number,
    "pauseTime": number,
    "observations": string,
    "weekDay": number
}
