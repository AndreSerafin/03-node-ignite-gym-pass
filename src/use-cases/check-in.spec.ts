import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkIns: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkIns = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkIns, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript gym',
      description: '',
      phone: '',
      latitude: -16.2846479,
      longitude: -48.9589726,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.2846479,
      userLongitude: -48.9589726,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.2846479,
      userLongitude: -48.9589726,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.2846479,
        userLongitude: -48.9589726,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, but in diferent days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.2846479,
      userLongitude: -48.9589726,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.2846479,
      userLongitude: -48.9589726,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.2967057),
      longitude: new Decimal(-48.909269),
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.2846479,
        userLongitude: -48.9589726,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
