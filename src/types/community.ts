export type Category = 'general' | 'simulation' | 'care' | 'guides' | 'results'
export type ContentType = 'Pregunta' | 'Experiencia' | 'Resultado' | 'Guía'
export type SortOrder = 'recent' | 'popular'

export interface Member {
  name: string
  initials: string
  tone: 'teal' | 'peach' | 'purple' | 'blue'
}

export interface Comment {
  id: string
  author: string
  text: string
}

export interface Post {
  id: string
  author: Member
  date: string
  category: Category
  type: ContentType
  text: string
  tags: string[]
  likes: number
  liked: boolean
  saved: boolean
  comments: Comment[]
  chart?: boolean
  image?: string
}
