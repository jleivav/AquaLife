export const simulationMetrics = [
  { label: 'Temperatura', value: '24,0', unit: '°C', color: '#b58b54', values: [22.8, 23.4, 24.4, 23.7, 24.2, 24.0], min: 22, max: 26, description: 'Temperatura entre 22,8 y 24,4 °C; último registro: 24 °C.' },
  { label: 'pH', value: '7,6', unit: 'pH', color: '#528c80', values: [7.0, 7.1, 7.4, 7.2, 7.5, 7.6], min: 6.5, max: 8, description: 'pH en aumento, desde 7,0 hasta 7,6.' },
  { label: 'Calidad del agua', value: '86', unit: '%', color: '#7c91a8', values: [95, 90, 91, 89, 87, 86], min: 70, max: 100, description: 'Índice ilustrativo de calidad del agua: de 95 a 86 por ciento.' },
  { label: 'Oxígeno', value: '5,1', unit: 'mg/L', color: '#8b82a4', values: [6.8, 6.0, 6.2, 5.7, 5.4, 5.1], min: 4, max: 8, description: 'Oxígeno en descenso, desde 6,8 hasta 5,1 miligramos por litro.' },
]

export const simulationHistory = [
  { date: '2026-09-13T09:30:00', label: '13 sep · 09:30', volume: '120 L', name: 'Acuario plantado', duration: '7 días' },
  { date: '2026-09-12T18:10:00', label: '12 sep · 18:10', volume: '60 L', name: 'Mi primer acuario', duration: '3 días' },
]
