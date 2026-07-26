import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cropsApi, type CropCreate, type CropUpdate } from '#/lib/api'

export const cropKeys = {
  all: ['crops'] as const,
  byProperty: (propertyId: string) => ['crops', 'property', propertyId] as const,
  detail: (id: string) => ['crops', id] as const,
  calculation: (id: string) => ['crops', id, 'calculation'] as const,
}

export function useCrops(propertyId: string) {
  return useQuery({
    queryKey: cropKeys.byProperty(propertyId),
    queryFn: () => cropsApi.listByProperty(propertyId),
    enabled: !!propertyId,
  })
}

export function useCrop(id: string) {
  return useQuery({
    queryKey: cropKeys.detail(id),
    queryFn: () => cropsApi.get(id),
    enabled: !!id,
  })
}

export function useCropCalculation(id: string) {
  return useQuery({
    queryKey: cropKeys.calculation(id),
    queryFn: () => cropsApi.getCalculation(id),
    enabled: !!id,
    retry: false,
  })
}

export function useCreateCrop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CropCreate) => cropsApi.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: cropKeys.byProperty(data.property_id),
      })
    },
  })
}

export function useUpdateCrop(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CropUpdate) => cropsApi.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cropKeys.detail(id) })
      queryClient.invalidateQueries({
        queryKey: cropKeys.byProperty(data.property_id),
      })
    },
  })
}

export function useDeleteCrop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) =>
      cropsApi.delete(id).then(() => ({ propertyId })),
    onSuccess: ({ propertyId }) => {
      queryClient.invalidateQueries({ queryKey: cropKeys.byProperty(propertyId) })
    },
  })
}
