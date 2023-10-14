import { DeleteExpiredRepositories } from '@/use-cases/repositories/delete-expired-repositories'
import schedule from 'node-schedule'

const deleteExpiredRepositoriesUseCase = new DeleteExpiredRepositories()

schedule.scheduleJob('*/5 * * * *', deleteExpiredRepositoriesUseCase.execute)
