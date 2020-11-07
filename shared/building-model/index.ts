/* eslint-disable @typescript-eslint/no-namespace */
declare namespace buildingModel {
  export type InventoryService = {
    index: () => GoogleAppsScript.HTML.HtmlOutput
    newStockIssuance: (req: StockIssuance) => void
    stockIssuanceList: () => StockIssuance[]
    inventoryList(): InventoryItem[]
  }

  export type StockIssuance = {
    rowIndex: number
    issueDate: string
    itemName: string
    quantity: number
    unit: string
    to: string
  }

  export type InventoryItem = {
    name: string
    unit: string
    category: string
  }
}

declare module '@shared/building-model' {
  export = buildingModel
}
