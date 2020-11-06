export type IdFunction = (action: RowAction) => string
export type RowAction = 'edit' | 'delete'
export type ActionFunction = (index: number, action: RowAction) => string
export type TableValueFunction<T> = (row: number, attr: keyof T) => string
export type RowValueFunction<T> = (attr: keyof T) => string
export type FormAttributeFunction<T> = (
  data: Partial<T>,
  name: string,
  value: string
) => void

export function getFormData<T>(
  form: JQuery<HTMLFormElement>,
  fn: FormAttributeFunction<T>
): T {
  const data: Partial<T> = {}
  form.serializeArray().forEach((entry) => fn(data, entry.name, entry.value))
  return data as T
}

export function tableHeader(headers: string[], widths: number[]): string {
  const ths = headers
    .map((header, index) => `<th class='col-${widths[index]}'>${header}</th>`)
    .join()

  return `<thead><tr class="d-flex">${ths}</tr></thead>`
}

export function editIcon(idfn: IdFunction): string {
  return `<span id="${idfn(
    'edit'
  )}"><i class="fa fa-pencil" style="color:darkblue;"></i></span>`
}

export function deleteIcon(idfn: IdFunction): string {
  return `<span id="${idfn(
    'delete'
  )}"><i class="fa fa-trash" style="color:darkblue;padding-left: 1em;"></i></span>`
}

export function tableRow<T>(
  attrs: (keyof T)[],
  widths: number[],
  valuefn: RowValueFunction<T>,
  idfn: IdFunction
): string {
  const tds = attrs
    .map(
      (attr, index) =>
        `<td class='small col-${widths[index]}'>${valuefn(attr)}</td>`
    )
    .join()

  let editCol = ''

  if (attrs.length < widths.length) {
    editCol = `<td class='col-${widths[attrs.length]}'>${editIcon(
      idfn
    )}${deleteIcon(idfn)}</td>`
  }
  return `<tr class='d-flex'>${tds}${editCol}</tr>`
}

export function tableBody<T>(
  rows: T[],
  attrs: (keyof T)[],
  widths: number[],
  valuefn: TableValueFunction<T>,
  actionfn: ActionFunction
): string {
  const trs = rows
    .map((row, index) =>
      tableRow(
        attrs,
        widths,
        (attr) => valuefn(index, attr),
        (action) => actionfn(index, action)
      )
    )
    .join()

  return `<tbody>${trs}</tbody>`
}
