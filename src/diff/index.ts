import { diffDatas } from './compareFile'
import logger, { makeLogger } from '@getCodeforce/logger'

try {
  logger.info(`diff starts`)
  diffDatas()
} catch (err) {
  logger.error(err)
}