import * as fs from 'fs'

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
