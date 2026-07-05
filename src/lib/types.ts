export type CableCat = 'instrument' | 'fng' | 'control' | 'power'

export interface Cable {
  id: string
  name: string
  cat: CableCat
  spec: string
  func: string
  area: string
  equip: string
  jb: string
  from: string
  to: string
  cut: number
}

export interface Project {
  id: string
  name: string
  client: string
  location: string
  pic: string
  contract: string
  handover: string
  createdAt: number
  cables: Cable[]
}
