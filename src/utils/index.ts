import * as fs from 'fs'
import logger from '@getCodeforce/logger'

const dataPath = `${__dirname}/../../datas`

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

export function parseCSV(path: string, sep='\t') {
  const data = fs.readFileSync(path, { encoding: 'utf-8' })
  const result = data.split('\n').map((d) => d.split(sep))

  const length = result[0].length
  for (let i = 0; i < result.length; i++) {
    if (result[i].length !== length) {
      logger.error(`Warning: CSV column number does not match at row ${i}`)
      console.error(`Warning: CSV column number does not match at row ${i}`)
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

export const sleep = (ms: number) => {
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}