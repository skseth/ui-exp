import { schemaRepository, SchemaValidator } from './schema'

export const shallowEqual = (obj1: any, obj2: any): boolean =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]
  )

export type FilterFlags<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}

export type ValueOf<T> = T[keyof T]

export type PickOne<T> = {
  [P in keyof T]: Record<P, T[P]> &
    Partial<Record<Exclude<keyof T, P>, undefined>>
}[keyof T]

export interface FormProp<T> {
  value: T
  onChange: (newItem: T) => void
  onCancel: () => void
}

export interface DialogProp<T> extends FormProp<T> {
  open: boolean
}

export interface TableProp<T> {
  value?: T[]
}

export type FormState<T> = {
  value: T
  isChanged: boolean
}

export interface TableState<T> {
  value: T[]
  editIndex: number
}

export type FormFieldAction<T, V> = {
  type: 'change' | 'focus' | 'blur'
  field: keyof FilterFlags<T, V>
  value: V
}

export type FormAction<T> =
  | FormFieldAction<T, ValueOf<T>>
  | { type: 'reset'; value: T }
  | { type: 'complete'; parentComplete?: (value: T) => void }
  | { type: 'cancel'; parentCancel?: () => void }

export type FormDispatch<T> = (action: FormAction<T>) => void
export type FormFieldChangeDispatch<T, V> = (
  field: keyof FilterFlags<T, V>,
  value: V
) => void

export type TableAction<T> =
  | { type: 'startAdd' }
  | { type: 'startUpdate'; index: number }
  | { type: 'change'; value: T }
  | { type: 'add'; value: T }
  | { type: 'remove'; index: number }
  | { type: 'fetched'; value: T[] }
  | { type: 'complete' }
  | { type: 'cancel' }

type TableDispatch<T> = (action: TableAction<T>) => void

type ControlDispatch<V> = (value: V) => void

export type ControlProps<V> = {
  id: string
  label: string
  autoFocus: boolean
  required: boolean
  disabled: boolean
  value?: V
  errors: string[]
  onChange: ControlDispatch<V>
  onBlur: ControlDispatch<V>
  onFocus: ControlDispatch<V>
}

type ControlPropFunctions<T> = Required<
  {
    [K in keyof T]: ControlProps<T[K]>
  }
>

export type FormPropFunctions<T> = {
  cp: ControlPropFunctions<T>
  fp: {
    onReset: () => void
    onComplete: () => void
    onCancel: () => void
  }
}

type TablePropFunctions<T> = {
  onBeginUpdate: (index: number) => void
  onBeginAdd: (index: number) => void
  onDelete: (index: number) => void
  onUpdate: (value: T) => void
  onAdd: (value: T) => void
  onCancelEdit: () => void
}

function generateProp<T, K extends keyof T>(
  key: K,
  schema: SchemaValidator,
  dispatch: FormDispatch<T>,
  value?: T[K]
): ControlProps<T[K]> {
  return {
    id: key as string,
    label: schema.title,
    autoFocus: false,
    required: schema.isRequired(),
    disabled: false,
    value,
    errors: [],
    onChange: (value) => dispatch({ type: 'change', field: key, value }),
    onBlur: (value) => dispatch({ type: 'blur', field: key, value }),
    onFocus: (value) => dispatch({ type: 'focus', field: key, value })
  }
}

export function generateControlProps<T>(
  schemaName: string,
  props: FormProp<T>,
  dispatch: FormDispatch<T>
): ControlPropFunctions<T> {
  const ret: Partial<ControlPropFunctions<T>> = {}

  const validator = schemaRepository.getSchemaValidator(schemaName)
  if (validator) {
    // potentially we may have a difference from the type here
    // tests may be important here against each schema/type combination
    for (const key in validator.properties) {
      const keyT = key as keyof T
      ret[keyT] = generateProp(
        keyT,
        validator.propertySchema(key),
        dispatch,
        props.value ? props.value[keyT] : undefined
      )
    }
  }

  return ret as ControlPropFunctions<T>
}

export function generateFormProps<T>(
  schemaName: string,
  props: FormProp<T>,
  dispatch: FormDispatch<T>
): FormPropFunctions<T> {
  return {
    cp: generateControlProps<T>(schemaName, props, dispatch),
    fp: {
      onCancel: () => {
        dispatch({ type: 'cancel', parentCancel: props.onCancel })
      },
      onReset: () => dispatch({ type: 'reset', value: props.value }),
      onComplete: () =>
        dispatch({ type: 'complete', parentComplete: props.onChange })
    }
  }
}

export function FormReducer<T>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case 'change': {
      const newvalue: T = { ...state.value, [action.field]: action.value }
      return { ...state, value: newvalue, isChanged: true }
    }
    case 'blur': {
      return state
    }
    case 'focus': {
      return state
    }
    case 'reset': {
      return { ...state, value: action.value, isChanged: false }
    }
    case 'cancel': {
      if (action.parentCancel) {
        action.parentCancel()
      }
      return state
    }
    case 'complete': {
      if (action.parentComplete) {
        action.parentComplete(state.value)
      }
      return state
    }
  }
}

// for non react scenarios
export function generateFormReducer<T>(
  schemaName: string,
  initialState: FormState<T>
): [() => FormState<T>, FormDispatch<T>] {
  const formref = {
    currentState: initialState
  }
  const dispatch = (action: FormAction<T>) => {
    formref.currentState = FormReducer<T>(formref.currentState, action)
  }

  return [() => formref.currentState, dispatch]
}

// for non react scenarios
export function initializeForm<T>(
  schemaName: string,
  props: FormProp<T>
): [() => FormState<T>, FormDispatch<T>, FormPropFunctions<T>] {
  const initialState = { value: props.value, isChanged: false }

  const [getState, dispatch] = generateFormReducer(schemaName, initialState)

  return [getState, dispatch, generateFormProps<T>(schemaName, props, dispatch)]
}

export function TableReducer<T>(
  state: TableState<T>,
  action: TableAction<T>
): TableState<T> {
  switch (action.type) {
    case 'startAdd': {
      return { ...state, editIndex: state.value.length }
    }
    case 'startUpdate': {
      return { ...state, editIndex: action.index }
    }
    case 'change': {
      const newValue = [...state.value]
      newValue.splice(state.editIndex, 1, action.value)
      return { ...state, value: newValue, editIndex: -1 }
    }
    case 'add': {
      const newValue = [...state.value]
      newValue.splice(state.editIndex, 0, action.value)
      return { ...state, value: newValue }
    }
    case 'remove': {
      const newValue = [...state.value]
      newValue.splice(state.editIndex, 1)
      return { ...state, value: newValue }
    }
    case 'fetched': {
      return { ...state, value: action.value }
    }

    case 'cancel': {
      return state
    }
    case 'complete': {
      return state
    }
  }
}

export function generateTableProps<T>(
  schemaName: string,
  props: TableProp<T>,
  dispatch: TableDispatch<T>
): TablePropFunctions<T> {
  return {
    onBeginUpdate: (index: number) => {
      dispatch({ type: 'startUpdate', index })
    },
    onBeginAdd: () => {
      dispatch({ type: 'startAdd' })
    },
    onDelete: (index: number) => {
      dispatch({ type: 'remove', index })
    },
    onUpdate: (value: T) => {
      dispatch({ type: 'change', value })
    },
    onAdd: (value: T) => {
      dispatch({ type: 'add', value })
    },
    onCancelEdit: () => {
      dispatch({ type: 'cancel' })
    }
  }
}

// for non react scenarios
export function initializeTable<T>(
  schemaName: string,
  props: TableProp<T>
): [() => TableState<T>, TableDispatch<T>, TablePropFunctions<T>] {
  const initialState = {
    value: props.value || [],
    editIndex: -1
  }
  const tableref = {
    currentState: initialState
  }
  const dispatch = (action: TableAction<T>) => {
    tableref.currentState = TableReducer<T>(tableref.currentState, action)
  }
  const fp = generateTableProps<T>(schemaName, props, dispatch)

  return [() => tableref.currentState, dispatch, fp]
}
