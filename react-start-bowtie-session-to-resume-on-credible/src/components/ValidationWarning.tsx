import { InputFieldType } from '@youngalfred/bowtie-sdk'

type Props = InputFieldType['valid']

const ValidationWarning = ({ valid, msg }: Props) =>
  valid ? null : <span className="warning">{msg}</span>

export default ValidationWarning
