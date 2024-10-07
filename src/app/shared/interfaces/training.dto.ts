export interface TrainingDto {
    exercise: string,
    repetitions: number,
    weight: number,
    pauseTime: number,
    observations?: string,
    weekDay: number,
    concluded: boolean
}

export interface RawTrainingDto {
    exercise: string,
    repetitions: number,
    weight: number,
    pauseTime: number,
    observations?: string
}

export interface StudentTrainingDto {
    trainingId: string,
    weekDay: number,
    concluded: boolean
}
