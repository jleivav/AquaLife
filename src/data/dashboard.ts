import type { Member } from '../types/community'

// Valores de demostración del mockup de Inicio.
export const dashboardParameters = [
  { label: 'Caudal (m³/s)', value: '125' },
  { label: 'Temperatura (°C)', value: '18,4' },
  { label: 'pH', value: '7,2' },
  { label: 'Turbidez (NTU)', value: '4,1' },
]

export const dashboardMembers: Member[] = [
  { name: 'María R.', initials: 'MR', tone: 'blue' },
  { name: 'EcoGuardians', initials: 'EG', tone: 'teal' },
  { name: 'Juan P.', initials: 'JP', tone: 'peach' },
]
