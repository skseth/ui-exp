import { stockIssuanceDialog } from './StockIssuanceDialog'
import { stockIssuanceTable } from './StockIssuanceTable'

$(function () {
  $('#tabs').tabs()
  stockIssuanceTable.initialize()
  stockIssuanceDialog.render({
    open: false
  })
})
