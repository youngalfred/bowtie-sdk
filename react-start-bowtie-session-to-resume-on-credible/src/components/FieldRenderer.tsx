import { SelectField } from '@youngalfred/bowtie-sdk'
import { InputField } from '../hooks/useFields'
import ValidationWarning from './ValidationWarning'

const Input = (field: InputField): JSX.Element | null => {
  switch (field.kind) {
    case 'text':
      return <input {...field.inputProps} />
    case 'select':
      return (
        <select {...field.inputProps}>
          {(field as SelectField).options.map(({ name, label }) => (
            <option key={name} value={name}>
              {label}
            </option>
          ))}
        </select>
      )
    default:
      return null
  }
}

type Props = {
  field: InputField
  Renderer?: (field: InputField) => JSX.Element | null
}
const FieldRenderer = ({ field, Renderer = Input }: Props) => {
  return (
    <div className="field">
      <label className="field-label" htmlFor={field.inputProps.id}>
        {field.label}
      </label>
      <Renderer {...field} />
      <ValidationWarning {...field.valid} />
    </div>
  )
}

export default FieldRenderer
