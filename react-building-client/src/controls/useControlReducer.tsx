import { Reducer, useMemo, useReducer } from 'react'
import { ajvSchema } from './AjvSchema'

type FilterFlags<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}

type ValueOf<T> = T[keyof T]

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

export type TableAction<T> =
  | { type: 'startAdd' }
  | { type: 'startUpdate'; index: number }
  | { type: 'change'; value: T }
  | { type: 'add'; value: T }
  | { type: 'remove'; index: number }
  | { type: 'fetched'; value: T[] }
  | { type: 'complete' }
  | { type: 'cancel' }

type ControlDispatch<V> = (value: V) => void

type ControlProps<V> = {
  id: string
  label: string
  autoFocus: boolean
  required: boolean
  disabled: boolean
  value: V
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

type FormPropFunctions<T> = {
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
  value: T[K],
  schema: any,
  dispatch: React.Dispatch<FormAction<T>>
): ControlProps<T[K]> {
  var required = false
  if (schema.required) {
    for (const reqKey of schema.required) {
      if (reqKey === key) {
        required = true
      }
    }
  }

  return {
    id: key as string,
    label: schema.properties[key].title,
    autoFocus: false,
    required,
    disabled: false,
    value: value,
    errors: [],
    onChange: (value) => dispatch({ type: 'change', field: key, value }),
    onBlur: (value) => dispatch({ type: 'blur', field: key, value }),
    onFocus: (value) => dispatch({ type: 'focus', field: key, value })
  }
}

export function useControlProps<T>(
  schemaName: string,
  props: FormProp<T>,
  dispatch: React.Dispatch<FormAction<T>>
): FormPropFunctions<T> {
  return useMemo(() => {
    const ret: Partial<ControlPropFunctions<T>> = {}

    const validator = ajvSchema.getSchemaValidator(schemaName)
    if (validator) {
      const schema: any = validator.schema

      // potentially we may have a difference from the type here
      // tests may be important here against each schema/type combination
      for (const key in schema.properties) {
        const keyT = key as keyof T
        ret[keyT] = generateProp(keyT, props.value[keyT], schema, dispatch)
      }
    }

    return {
      cp: ret as ControlPropFunctions<T>,
      fp: {
        onCancel: () => {
          dispatch({ type: 'cancel', parentCancel: props.onCancel })
        },
        onReset: () => dispatch({ type: 'reset', value: props.value }),
        onComplete: () =>
          dispatch({ type: 'complete', parentComplete: props.onChange })
      }
    }
  }, [props.value, dispatch])
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

export function useFormReducer<T>(
  schemaName: string,
  props: FormProp<T>
): [FormState<T>, React.Dispatch<FormAction<T>>, FormPropFunctions<T>] {
  const [state, dispatch] = useReducer<Reducer<FormState<T>, FormAction<T>>>(
    FormReducer,
    {
      value: props.value,
      isChanged: true
    }
  )

  const cp = useControlProps<T>(schemaName, props, dispatch)
  return [state, dispatch, cp]
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

export function useTableReducer<T>(
  schemaName: string,
  props: TableProp<T>
): [TableState<T>, React.Dispatch<TableAction<T>>, TablePropFunctions<T>] {
  const [state, dispatch] = useReducer<Reducer<TableState<T>, TableAction<T>>>(
    TableReducer,
    {
      value: props.value || [],
      editIndex: -1
    }
  )

  const tp: TablePropFunctions<T> = useMemo(
    () => ({
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
    }),
    [dispatch]
  )
  return [state, dispatch, tp]
}
