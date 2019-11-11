import { dataDirIterator, parseCSV } from '@getCodeforce/src/utils'
import logger, { makeLogger } from '@getCodeforce/logger'
import * as fs from 'fs'

const savePathDir = `${__dirname}/../../pairData`

function readLexed(path: string) {
  if (fs.existsSync(path)) {
    return parseCSV(path, '\t')
  }
  return [[]]
}

function diffTwoCSV(cmp: string[][], base: string[][]): number {
  if (cmp.length !== base.length) {
    return -1
  }

  let diffTokenCount = 0
  for (let i = 0; i < cmp.length; i++) {
    if (cmp[i][5] !== base[i][5]) {
      diffTokenCount += 1
    }
  }

  return diffTokenCount
}

function savePair(now: string, wrongPath: string, okPath: string) {
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

export function diffLexed() {
  const iterator = dataDirIterator()
  let pathdirIter = iterator.next()
  let nowpathdir: string
  let nowpathdirList: string[] = []

  while (!pathdirIter.done) {
    const routeList = pathdirIter.value.split('/')
    const thispath = routeList.filter((n, i) => i !== routeList.length - 1).join('/')
    pathdirIter = iterator.next()
    
    if (thispath === nowpathdir) {
      nowpathdirList.push(routeList[routeList.length - 1])
    } else {
      if (nowpathdir) {
        let okidx: number = 0
        const okdir = nowpathdirList.filter((n, i) => {
          const result = n.substr(n.length - 2, 2) === 'OK'
          if (result) {
            okidx = i
          }
          return result
        })[0]

        if (!fs.existsSync(`${nowpathdir}/${okdir}/lexed.csv`)) {
          console.log(`ok lexed not exist ${nowpathdir}/${okdir}/lexed.csv`)
          okidx = -1
        }
        let okdata: string[][] = readLexed(`${nowpathdir}/${okdir}/lexed.csv`)
  
        for (let i = 0; i < okidx; i++) {
          if (nowpathdirList[i].substr(nowpathdirList[i].length - 2, 2) !== 'WA') {
            continue
          }
  
          if (!fs.existsSync(`${nowpathdir}/${nowpathdirList[i]}/lexed.csv`)) {
            console.log(`now lexed not exist ${nowpathdir}/${nowpathdirList[i]}/lexed.csv`)
            continue
          }  
          let wrongdata: string[][] = readLexed(`${nowpathdir}/${nowpathdirList[i]}/lexed.csv`)
          
          const diffTokenCount = diffTwoCSV(wrongdata, okdata)
  
          if (diffTokenCount === 1) {
            savePair(nowpathdir, nowpathdirList[i], okdir)
          }
        }
      }

      nowpathdir = thispath
      nowpathdirList = [routeList[routeList.length - 1]]
      console.log(`${nowpathdir} looking start`)
    }
  }
}