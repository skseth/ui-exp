import { StockIssuance } from '@shared/building-model'
import { stockIssuanceDialog } from './StockIssuanceDialog'
import { RowAction, tableBody, tableHeader } from './uiutils'

class StockIssuanceTable {
  updateTable(issuances: StockIssuance[]) {
    const widths = [2, 4, 1, 1, 2, 2]
    const headers = ['Issue Date', 'Item', 'Unit', 'Quantity', 'To', 'Action']
    const attrs: (keyof StockIssuance)[] = [
      'issueDate',
      'itemName',
      'unit',
      'quantity',
      'to'
    ]

    const idfn = (row: number, action: RowAction) => {
      return `si-items-${row}-${action}`
    }

    $('#si-items').html(
      `${tableHeader(headers, widths)}${tableBody(
        issuances,
        attrs,
        widths,
        (r: number, c: keyof StockIssuance) => issuances[r][c].toString(),
        idfn
      )}`
    )

    issuances.forEach((value, row) => {
      $('#' + idfn(row, 'edit')).click(() => {
        stockIssuanceDialog.render({
          value,
          onCancel: () => {
            console.log('canceled')
          },
          onChange: () => {
            console.log('changed')
          },
          open: true
        })
      })
      $('#' + idfn(row, 'delete')).click(() =>
        alert(`row ${row} for delete clicked`)
      )
    })
  }

  reloadTable() {
    google.script.run
      .withFailureHandler((error) => console.log(error))
      .withSuccessHandler((items) => {
        console.log(items)
        this.updateTable(items as StockIssuance[])
      })
      .stockIssuanceList()
  }

  initialize() {
    this.reloadTable()

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    $('#si-new-open').on('click', (_event: JQuery.Event) => {
      stockIssuanceDialog.render({
        onChange: () => this.reloadTable(),
        open: true
      })
      return false
    })
  }
}

export const stockIssuanceTable = new StockIssuanceTable()
