import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL as string

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers ?? {}) },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error?.detail ?? 'API Error')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Types ──────────────────────────────────────────────────────────────────
// Alinhados com os schemas Pydantic do backend (PropertyRead, CropRead, CalculationRead)

export interface Property {
  id: string
  name: string
  h3_token: string
  created_at: string
  updated_at: string
}

export interface PropertyCreate {
  name?: string | null
  h3_token: string
}

export interface PropertyUpdate {
  name?: string
}

export interface Crop {
  id: string
  property_id: string
  name: string
  crop_type: string
  irrigation_system_type: string
  irrigation_turn: number
  planting_date: string
  area_planted_hectares: number
  created_at: string
  updated_at: string
}

export interface CropCreate {
  property_id: string
  name: string
  crop_type: string
  irrigation_system_type: string
  irrigation_turn?: number
  planting_date: string
  area_planted_hectares: number
}

export interface CropUpdate {
  name?: string
  crop_type?: string
  irrigation_system_type?: string
  irrigation_turn?: number
  planting_date?: string
  area_planted_hectares?: number
}

export interface Calculation {
  id: string
  calculated_at: string
  h3_token: string
  etcrop_mm: number
  irrigation_turn: number
  lamina_liquida_mm: number
  lamina_bruta_mm: number
  tempo_irrigacao_hours: number
  volume_total_liters: number
  climate_data_id: string
  crop_id: string | null
}

// ── Properties ────────────────────────────────────────────────────────────

export const propertiesApi = {
  list: () => apiFetch<Property[]>('/api/v1/properties'),
  get: (id: string) => apiFetch<Property>(`/api/v1/properties/${id}`),
  create: (payload: PropertyCreate) =>
    apiFetch<Property>('/api/v1/properties', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: PropertyUpdate) =>
    apiFetch<Property>(`/api/v1/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/api/v1/properties/${id}`, { method: 'DELETE' }),
}

// ── Crops ─────────────────────────────────────────────────────────────────

export const cropsApi = {
  listByProperty: (propertyId: string) =>
    apiFetch<Crop[]>(`/api/v1/crops/property/${propertyId}`),
  get: (id: string) => apiFetch<Crop>(`/api/v1/crops/${id}`),
  create: (payload: CropCreate) =>
    apiFetch<Crop>('/api/v1/crops', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: CropUpdate) =>
    apiFetch<Crop>(`/api/v1/crops/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/api/v1/crops/${id}`, { method: 'DELETE' }),
  getCalculation: (id: string) =>
    apiFetch<Calculation>(`/api/v1/crops/${id}/calculation`),
}
