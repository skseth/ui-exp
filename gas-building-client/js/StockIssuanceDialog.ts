import {
  DialogProp,
  FilterFlags,
  FormAction,
  FormPropFunctions,
  FormState,
  generateFormProps,
  generateFormReducer,
  shallowEqual,
  ValueOf
} from '@shared/ui-lib'
import { StockIssuance } from '@shared/building-model'
import { Inventory } from './Inventory'

export abstract class Dialog<T> {
  firstRun = true
  #resetValue: T
  #props: DialogProp<T>
  getState: () => FormState<T>
  dispatch: (action: FormAction<T>) => void
  fp: FormPropFunctions<T>
  dialogId: string
  renderState?: FormState<T>
  schemaName: string

  constructor(dialogId: string, schemaName: string, value: T) {
    this.dialogId = dialogId
    this.schemaName = schemaName
    this.#resetValue = value

    const [getState, dispatch] = generateFormReducer<T>(this.schemaName, {
      value,
      isChanged: true
    })

    this.getState = getState
    this.dispatch = dispatch

    this.#props = {
      value,
      open: false,
      onCancel: () => {
        /* do nothing*/
      },
      onChange: () => {
        /* do nothing*/
      }
    }
    this.fp = generateFormProps(this.schemaName, this.props, this.dispatch)
  }

  get defaultProps(): DialogProp<T> {
    return {
      value: this.#resetValue,
      open: false,
      onCancel: () => {
        /* do nothing*/
      },
      onChange: () => {
        /* do nothing*/
      }
    }
  }

  get props(): DialogProp<T> {
    return this.#props
  }

  setProps(newProps: Partial<DialogProp<T>>): boolean {
    const fullProps: DialogProp<T> = Object.assign(
      {},
      this.defaultProps,
      newProps
    )
    if (shallowEqual(fullProps, this.#props)) return false
    this.#props = fullProps
    this.fp = generateFormProps(this.schemaName, this.props, this.dispatch)
    return true
  }

  dispatchChange<V extends ValueOf<T>>(
    field: keyof FilterFlags<T, V>,
    value: V
  ): void {
    this.dispatch({ type: 'change', field, value })
  }

  render(props: Partial<DialogProp<T>>): void {
    const state = this.getState()
    if (this.setProps(props) || state !== this.renderState) {
      this.mustRender()
      this.renderState = state
    }
  }

  abstract mustRender(): void
}

class StockIssuanceDialog extends Dialog<StockIssuance> {
  #form: JQuery<HTMLFormElement> = $('#si-new-form')
  #issueDateEl: JQuery<HTMLInputElement> = $('#si-new-issueDate')
  #itemEl: JQuery<HTMLInputElement> = $('#si-new-item')
  #unitsEl: JQuery<HTMLLabelElement> = $('#si-new-units')
  #quantityEl: JQuery<HTMLInputElement> = $('#si-new-quantity')
  #toEl: JQuery<HTMLLabelElement> = $('#si-new-to')
  #inventory: Inventory | null = null

  constructor() {
    super('#si-right', 'StockIssuance', {
      issueDate: '20202001',
      itemName: '',
      unit: 'units',
      quantity: 0,
      rowIndex: -1,
      to: ''
    })
    $(this.dialogId).dialog({
      autoOpen: false,
      modal: true,
      show: 'blind',
      hide: 'blind',
      dialogClass: 'dialog-no-close'
    })
    Inventory.initialize().then((i) => {
      this.#inventory = i
      this.#itemEl.autocomplete({ source: this.#inventory.list })
    })
  }

  close() {
    this.render({ open: false, onCancel: () => 1, onChange: () => 1 })
  }

  mustRender(): void {
    const value = this.props.value

    this.#issueDateEl.val(value?.issueDate)
    this.#itemEl.val(value?.itemName)
    this.#quantityEl.val(value?.quantity)
    this.#unitsEl.html(value?.unit || 'units')
    this.#toEl.val(value?.to)

    if ($(this.dialogId).dialog('isOpen') != this.props.open) {
      if (this.props.open) {
        console.log(`showing dialog`)
        this.renderOnOpen()
      } else {
        console.log(`closing dialog`)
        $(this.dialogId).dialog('close')
      }
    }
  }

  renderOnOpen() {
    const isNewMode = this.props.value ? this.props.value.rowIndex < 0 : true

    // initialize values
    $(this.dialogId).dialog(
      'option',
      'title',
      isNewMode ? 'Add Stock Issuance' : 'Edit Stock Issuance'
    )

    // event handlers
    this.#itemEl.on('change', (e: JQuery.ChangeEvent<HTMLInputElement>) => {
      this.#unitsEl.html(this.#inventory?.unit(e.target.value) || 'units')
    })

    $(this.dialogId).on('dialogclose', (_e: JQuery.Event) => {
      console.log(`dialog closed`)
      this.props?.onCancel?.()
    })

    this.#form.on('submit', (event) => {
      const value = this.getValue()

      console.log(value)

      google.script.run
        .withFailureHandler((error: Error) => console.log(error))
        .withSuccessHandler(() => this.props?.onChange?.(value))
        .newStockIssuance(value)
      event.preventDefault()
    })

    $(this.dialogId).dialog('open')
    // set autofocus
  }

  getValue(): StockIssuance {
    return {
      rowIndex: this.getState().value?.rowIndex,
      issueDate: this.#issueDateEl.val() as string,
      itemName: this.#itemEl.val() as string,
      quantity: this.#quantityEl.val() as number,
      unit: this.#unitsEl.val() as string,
      to: this.#toEl.val() as string
    }
  }
}

export const stockIssuanceDialog = new StockIssuanceDialog()
