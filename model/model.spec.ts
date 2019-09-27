import { existData, createTable, writeData, docClient } from './'
import datas from './data'

// createTable()
async function test() {
  console.log(await existData({
    user: 'AlexPop28',
    problem: '1209-E2-60580619'
  }))
}

test()