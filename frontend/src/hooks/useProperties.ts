import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { propertiesApi, type PropertyCreate, type PropertyUpdate } from '#/lib/api'

export const propertyKeys = {
  all: ['properties'] as const,
  detail: (id: string) => ['properties', id] as const,
}

export function useProperties() {
  return useQuery({
    queryKey: propertyKeys.all,
    queryFn: () => propertiesApi.list(),
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.get(id),
    enabled: !!id,
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PropertyCreate) => propertiesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PropertyUpdate) =>
      propertiesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) })
    },
  })
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}
