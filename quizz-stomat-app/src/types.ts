export interface Answer {
  text: string
  value: number
}

export interface Question {
  qText: string
  picture?: string
  qAnswers: Answer[]
}

export interface QuizSection {
  title: string
  questions: Question[]
}

export interface QuizResults {
  sectionId: number
  sectionTitle: string
  questions: {
    question: string
    selectedAnswer: string
    value: number
  }[]
  totalScore: number
}
