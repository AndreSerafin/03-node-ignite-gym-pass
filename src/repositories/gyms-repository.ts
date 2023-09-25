import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Array<Gym>>
  searchMany(query: string, page: number): Promise<Array<Gym>>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
