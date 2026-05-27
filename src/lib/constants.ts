import { CableCat } from './types'

export const CAT_CONFIG: Record<CableCat, {
  label: string
  subtitle: string
  shortLabel: string
  disc: 'instrument' | 'electrical'
  defaultTol: number
  splice: boolean
  tagClass: string
  dotClass: string
}> = {
  instrument: {
    label: 'Instrumentation',
    subtitle: 'Signal, transmitter',
    shortLabel: 'Inst.',
    disc: 'instrument',
    defaultTol: 3,
    splice: false,
    tagClass: 'bg-blue-50 text-blue-600',
    dotClass: 'bg-blue-500',
  },
  fng: {
    label: 'Fire & Gas',
    subtitle: 'Detection, safety',
    shortLabel: 'F&G',
    disc: 'instrument',
    defaultTol: 5,
    splice: false,
    tagClass: 'bg-red-50 text-red-600',
    dotClass: 'bg-red-500',
  },
  control: {
    label: 'Control',
    subtitle: 'ESD, solenoid',
    shortLabel: 'Ctrl',
    disc: 'instrument',
    defaultTol: 3,
    splice: false,
    tagClass: 'bg-purple-50 text-purple-600',
    dotClass: 'bg-purple-500',
  },
  power: {
    label: 'Power',
    subtitle: 'Power distribution',
    shortLabel: 'Pwr',
    disc: 'electrical',
    defaultTol: 3,
    splice: true,
    tagClass: 'bg-orange-50 text-orange-600',
    dotClass: 'bg-orange-500',
  },
}

export const DRUM_SIZES = [250, 305, 500, 1000]
