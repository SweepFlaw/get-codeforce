import { dataDirIterator, parseCSV } from '@getCodeforce/src/utils'
import logger, { makeLogger } from '@getCodeforce/logger'
import * as fs from 'fs'
import data from '@getCodeforce/model/data'

export function diffLexed() {
  const iterator = dataDirIterator()
  let pathdirIter = iterator.next()

  while (!pathdirIter.done) {
    const pathdir = pathdirIter.value
    if (fs.existsSync(`${pathdir}/lexed.csv`)) {
      const data = parseCSV(`${pathdir}/lexed.csv`, '\t')
      
    }

    pathdirIter = iterator.next()
  }
}