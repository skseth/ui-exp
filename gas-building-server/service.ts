// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InventoryItem, StockIssuance } from '../shared/building-model/index'
import {
  getStartOfLastWeek,
  isLater,
  DateToYYYYMMDD
} from '../shared/date-lib/index'
import { openSheet } from '../shared/gas-lib/sheet_utils'

const si_issuance = 'Stock Issuance'
const si_inventory = 'Inventory'
const si_url =
  'https://docs.google.com/spreadsheets/d/1JGlW1v2D2Zaj6qf_47654LRIFzs18zlCbAICjmykPQE/edit#gid=626867041'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class InventoryService implements InventoryService {
  static index(): GoogleAppsScript.HTML.HtmlOutput {
    return HtmlService.createTemplateFromFile('si').evaluate()
  }

  static newStockIssuance(req: StockIssuance): void {
    Logger.log(req)
    const ws = openSheet(si_url, si_issuance)
    ws.appendRow([req.issueDate, req.itemName, 'unit', req.quantity, req.to])
  }

  static stockIssuanceList(): StockIssuance[] {
    const ws = openSheet(si_url, si_issuance)

    const values = ws.getDataRange().getValues()

    const startOfWeek = getStartOfLastWeek()

    const retval = values
      .filter((row) => (isLater(row[0], startOfWeek) ? true : false))
      .map((row, index) => ({
        rowIndex: index,
        issueDate: DateToYYYYMMDD(row[0]),
        itemName: row[1],
        unit: row[2],
        quantity: row[3],
        to: row[4]
      }))
      .sort((a, b) =>
        a['issueDate'] < b['issueDate']
          ? 1
          : a['issueDate'] > b['issueDate']
          ? -1
          : b['rowIndex'] - a['rowIndex']
      )

    Logger.log(retval)

    return retval
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static inventoryList(): InventoryItem[] {
    const ws = openSheet(si_url, si_inventory)

    const range = ws.getRange(2, 1, 200, 3).getValues()

    const retval = range
      .filter((row) => (row[0] ? true : false))
      .map((row) => ({ name: row[0], unit: row[1], category: row[2] }))

    return retval
  }
}
