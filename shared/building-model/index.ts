/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare type InventoryService = {
  index: () => GoogleAppsScript.HTML.HtmlOutput
  newStockIssuance: (req: model.StockIssuance) => void
  stockIssuanceList: () => model.StockIssuance[]
  inventoryList(): model.InventoryItem[]
}

declare namespace model {
  type StockIssuance = {
    rowIndex: number
    issueDate: string
    itemName: string
    quantity: number
    unit: string
    to: string
  }

  type InventoryItem = {
    name: string
    unit: string
    category: string
  }
}
