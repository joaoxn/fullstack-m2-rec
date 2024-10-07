export interface TrainingDto {
    exercise: string,
    repetitions: number,
    weight: number,
    pauseTime: number,
    observations?: string,
    weekDay: number
}

export interface StudentTrainingDto {
    trainingId: string,
    weekDay: number,
    concluded: boolean
}
