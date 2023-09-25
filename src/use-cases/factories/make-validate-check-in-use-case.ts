import { ValidateCheckInUseCase } from '../validate-check-in'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeValidateCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
