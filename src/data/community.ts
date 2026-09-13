import type { Category, ContentType, Member, Post } from '../types/community'

export const currentUser: Member = { name: 'Alex Muñoz', initials: 'AM', tone: 'teal' }

export const categories: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'simulation', label: 'Simulación' },
  { id: 'care', label: 'Cuidados' },
  { id: 'guides', label: 'Guías' },
  { id: 'results', label: 'Resultados' },
]

export const contentTypes: ContentType[] = ['Pregunta', 'Experiencia', 'Resultado', 'Guía']
export const popularTags = ['Principiantes', 'AguaDulce', 'Plantas', 'Acuarios']

// Perfiles, publicaciones y puntajes ficticios para la demostración.
export const initialPosts: Post[] = [
  {
    id: 'post-1',
    author: { name: 'Camila Torres', initials: 'CT', tone: 'peach' },
    date: '2026-09-13T12:30:00Z',
    category: 'care',
    type: 'Pregunta',
    text: '¡Hola, comunidad! 🐠 Estoy preparando mi primer acuario de agua dulce de 60 litros y quiero agregar plantas naturales. ¿Qué plantas les han resultado más fáciles de mantener al comenzar? Los leo.',
    tags: ['Principiantes', 'AguaDulce', 'Plantas'],
    likes: 24,
    liked: false,
    saved: false,
    comments: [
      { id: 'comment-1', author: 'Diego Silva', text: '¡Bienvenida! Yo empecé con anubias. Me encantaría ver cómo queda tu acuario.' },
      { id: 'comment-2', author: 'Valentina Rojas', text: 'Estoy en las mismas. Me quedo atenta a las experiencias de la comunidad.' },
    ],
  },
  {
    id: 'post-2',
    author: { name: 'Diego Silva', initials: 'DS', tone: 'blue' },
    date: '2026-09-13T11:15:00Z',
    category: 'results',
    type: 'Resultado',
    text: 'Así va mi acuario de 120 litros. Comparto un ejemplo del seguimiento del pH durante la semana. Me está ayudando a entender mejor los cambios del ecosistema. 🌿',
    tags: ['AguaDulce', 'Acuarios'],
    likes: 38,
    liked: false,
    saved: false,
    comments: [],
    chart: true,
  },
  {
    id: 'post-3',
    author: { name: 'Valentina Rojas', initials: 'VR', tone: 'purple' },
    date: '2026-09-12T16:00:00Z',
    category: 'guides',
    type: 'Guía',
    text: 'Mi consejo para empezar: llevar una bitácora. Anoto las observaciones del acuario, los cambios que hago y las dudas que quiero consultar. Es una forma sencilla de aprender de cada experiencia.',
    tags: ['Principiantes', 'Acuarios'],
    likes: 56,
    liked: false,
    saved: false,
    comments: [],
  },
  {
    id: 'post-4',
    author: { name: 'Nicolás Pérez', initials: 'NP', tone: 'teal' },
    date: '2026-09-11T14:00:00Z',
    category: 'simulation',
    type: 'Experiencia',
    text: 'Me gustaría comparar un acuario con plantas y otro sin plantas cuando tengamos el simulador. ¿Qué escenarios les gustaría explorar?',
    tags: ['Plantas', 'Acuarios'],
    likes: 12,
    liked: false,
    saved: false,
    comments: [],
  },
]

export const ranking = [
  { name: 'Valentina Rojas', initials: 'VR', tone: 'purple', week: 1280, month: 3420 },
  { name: 'Diego Silva', initials: 'DS', tone: 'blue', week: 960, month: 3870 },
  { name: 'Camila Torres', initials: 'CT', tone: 'peach', week: 840, month: 2650 },
  { name: 'Nicolás Pérez', initials: 'NP', tone: 'teal', week: 720, month: 2180 },
] satisfies (Member & { week: number; month: number })[]

export const connections = [
  { name: 'Diego Silva', initials: 'DS', tone: 'blue', online: true },
  { name: 'Valentina Rojas', initials: 'VR', tone: 'purple', online: true },
  { name: 'Nicolás Pérez', initials: 'NP', tone: 'teal', online: false },
] satisfies (Member & { online: boolean })[]
