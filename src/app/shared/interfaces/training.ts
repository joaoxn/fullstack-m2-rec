export interface Training {
    id: string,
    exercise: string,
    repetitions: number,
    weight: number,
    pauseTime: number,
    observations?: string,
    weekDay: number,
    concluded: boolean
}

export interface RawTraining {
    id: string,
    exercise: string,
    repetitions: number,
    weight: number,
    pauseTime: number,
    observations?: string
}
