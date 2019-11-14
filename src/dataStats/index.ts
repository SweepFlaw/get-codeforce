import { problemIndexDirIterator, parseCSV, savePair, savePathDir } from '@getCodeforce/src/utils'
import logger from '@getCodeforce/logger'
import * as fs from 'fs'

interface Stat {
  total: number
  oneTimeSolve: number
  cannotSolve: number
  littleDiff: number
}

interface Stats {
  [problemindex: string]: Stat
}

/**
 * Statistics of each problem index
 * not only contest div but also problem index has the difficult degree for solving.
 * if the index is higher, the problem is hard.
 * so, find the solving process of people about that problem index and get the statistics about that
 * - one time solve ratio
 * - can't solve ratio
 * - a word diff wrong_answer before ok ratio
 */
function getStats() {
  const iterator = problemIndexDirIterator()
  let probIter = iterator.next()

  const stats: Stats = {}
  const pairDatas = fs.readdirSync(savePathDir)

  while (!probIter.done) {
    const probdir = probIter.value
    probIter = iterator.next()

    const elements = probdir.split('/')
    const submissionIds = fs.readdirSync(probdir)
    const problemindex = elements[elements.length - 1]    
    
    if (!stats[problemindex]) {
      stats[problemindex] = {
        total: 0,
        oneTimeSolve: 0,
        cannotSolve: 0,
        littleDiff: 0
      }
    }

    stats[problemindex].total += 1
    if (submissionIds.length === 1 && submissionIds[0].substr(submissionIds[0].length - 2, 2) === 'OK') {
      stats[problemindex].oneTimeSolve += 1
    } else {
      stats[problemindex].cannotSolve += 1
      for (const submissionId of submissionIds) {
        if (submissionId.substr(submissionId.length - 2, 2) === 'OK') {
          stats[problemindex].cannotSolve -= 1
          break
        }
      }

      elements[5] = 'diff'
      const pddirname = elements.join('_')
      if (pairDatas.includes(pddirname)) {
        stats[problemindex].littleDiff += 1
        fs.writeFileSync(`${savePathDir}/${pddirname}/subIds.txt`, submissionIds.join('\n'))
      }
    }
    console.log(probdir)
  }

  for (const pidx in stats) {
    logger.info(`P.${pidx} total: ${stats[pidx].total}`)
    logger.info(`P.${pidx} one time solve ratio: ${stats[pidx].oneTimeSolve / stats[pidx].total}`)
    logger.info(`P.${pidx} cannot solve ratio: ${stats[pidx].cannotSolve / stats[pidx].total}`)
    logger.info(`P.${pidx} little diff ratio: ${stats[pidx].littleDiff / stats[pidx].total}`)
    console.log(`P.${pidx} total: ${stats[pidx].total}`)
    console.log(`P.${pidx} one time solve ratio: ${stats[pidx].oneTimeSolve / stats[pidx].total}`)
    console.log(`P.${pidx} cannot solve ratio: ${stats[pidx].cannotSolve / stats[pidx].total}`)
    console.log(`P.${pidx} little diff ratio: ${stats[pidx].littleDiff / stats[pidx].total}`)
  }
}

try {
  getStats()
} catch (err) {
  logger.error(err)
  console.error(err)
}