/* eslint-disable @typescript-eslint/no-unused-vars */
const InventoryService = () =>
  modules['gas-building-server/service'].exports
    .InventoryService as InventoryService

const doGet = () => InventoryService().index()
const newStockIssuance = (req: model.StockIssuance) =>
  InventoryService().newStockIssuance(req)
const stockIssuanceList = () => InventoryService().stockIssuanceList()
const inventoryList = () => InventoryService().inventoryList()
