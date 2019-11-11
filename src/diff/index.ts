import { diffDatas } from './compareFile'
import { diffLexed } from './compareLex'
import logger, { makeLogger } from '@getCodeforce/logger'

try {
  const args = process.argv
  
  if (args.length >= 3 && args[2] == 'lex') {
    logger.info(`diff lex starts`)
    console.log(`diff lex starts`)
    diffLexed()
  } else {
    logger.info(`diff file starts`)
    diffDatas()
  }
} catch (err) {
  logger.error(err)
}