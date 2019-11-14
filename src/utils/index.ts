import * as fs from 'fs'
import logger from '@getCodeforce/logger'

const dataPath = `${__dirname}/../../datas`
export const savePathDir = `${__dirname}/../../pairData` 
/**
 * submission id단 까지 iterate
 */
export function* dataDirIterator() {
  const contestIds = fs.readdirSync(dataPath)
  for (const contestId of contestIds) {
    const users = fs.readdirSync(`${dataPath}/${contestId}`)
    for (const user of users) {
      const problemIndexes = fs.readdirSync(`${dataPath}/${contestId}/${user}`)
      for (const problemIndex of problemIndexes) {
        const submissionIds = fs.readdirSync(`${dataPath}/${contestId}/${user}/${problemIndex}`)
        for (const subi of submissionIds) {
          const codedir = `${dataPath}/${contestId}/${user}/${problemIndex}/${subi}`
          
          yield codedir
        }
      }
    }
  }

  return ''
}

/**
 * problem index까지만 iterate
 */
export function* problemIndexDirIterator() {
  const contestIds = fs.readdirSync(dataPath)
  for (const contestId of contestIds) {
    const users = fs.readdirSync(`${dataPath}/${contestId}`)
    for (const user of users) {
      const problemIndexes = fs.readdirSync(`${dataPath}/${contestId}/${user}`)
      for (const problemIndex of problemIndexes) {
        const codedir = `${dataPath}/${contestId}/${user}/${problemIndex}`
        
        yield codedir
      }
    }
  }

  return ''
}

export function parseCSV(path: string, sep='\t') {
  const data = fs.readFileSync(path, { encoding: 'utf-8' })
  const result = data.split('\n').map((d) => d.split(sep))

  const length = result[0].length
  for (let i = 0; i < result.length; i++) {
    if (result[i].length !== length) {
      logger.error(`Warning: CSV column number does not match at row ${i}`)
      // console.error(`Warning: CSV column number does not match at row ${i}`)
    }
  }

  return result
}

export function saveCSV(data: string[][], path: string, sep='\t') {
  const result: string = data
    .map((d: string[]) => d.join(sep))
    .join('\n')
  
  fs.writeFileSync(path, result)
}

/**
 * save pair of ok and wrong_answer codes
 * @param now 
 * @param wrongPath 
 * @param okPath 
 * @param savePathDir 
 */
export function savePair(now: string, wrongPath: string, okPath: string, savePathDir) {
  logger.info(`save pair
  ${now}/${wrongPath}
  ${now}/${okPath}
`)
  const dirname = now.split('/').join('_')
  
  if (!fs.existsSync(savePathDir)) {
    fs.mkdirSync(savePathDir)
  }
  if (!fs.existsSync(`${savePathDir}/${dirname}`)) {
    fs.mkdirSync(`${savePathDir}/${dirname}`)
  }

  fs.copyFileSync(`${now}/${wrongPath}/code.cpp`, `${savePathDir}/${dirname}/${wrongPath}.cpp`)
  fs.copyFileSync(`${now}/${okPath}/code.cpp`, `${savePathDir}/${dirname}/${okPath}.cpp`)
}

export const sleep = (ms: number) => {
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}