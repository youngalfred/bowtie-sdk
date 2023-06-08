import { FormEvent, useState } from 'react'
import usePortfolio from '../hooks/usePortfolio'
import useFields, { FieldIdPair } from '../hooks/useFields'
import sampleApp from '../data/application.json'
import { BowtieApiPortfolio, startBowtieSessionToResumeOnCredible } from '@youngalfred/bowtie-sdk'
import FieldRenderer from './FieldRenderer'

const base = 'http://localhost:3001/'

const ids: FieldIdPair[] = [
  ['start.policyType', 'policyType'],
  ['start.firstName', 'firstName'],
  ['start.emailAddress', 'email'],
  ['home.primaryPolicyHolder.birthDate', 'homeBirthDate'],
  ['auto.drivers.0.birthDate', 'driverBirthDate'],
]

const StarterForm = () => {
  const [{ submitting, success, attempted }, setSubmitState] = useState({
    success: false,
    submitting: false,
    attempted: false,
  })
  const [portfolio, updateField] = usePortfolio(sampleApp)

  const { policyType, firstName, email, homeBirthDate, driverBirthDate } = useFields(
    portfolio,
    ids,
    updateField,
  )

  // birthDate is used for home apps
  // while driverBirthdate is used for auto apps
  const birthDate = homeBirthDate || driverBirthDate

  const isFormInvalid = [policyType, firstName, email, birthDate].some(({ valid }) => !valid.valid)

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    setSubmitState(prev => ({ ...prev, submitting: true }))

    let success = true
    try {
      const application = portfolio.application as BowtieApiPortfolio
      await startBowtieSessionToResumeOnCredible({ url: `${base}session/macro`, application })
    } catch (err) {
      console.error(err)
      success = false
    } finally {
      setSubmitState({ attempted: true, success, submitting: false })
    }
  }

  return (
    <form id="client-info" onSubmit={submit}>
      <ul id="input-container">
        {[policyType, firstName, email, birthDate].map(f => (
          <li key={f.id}>
            <FieldRenderer field={f} />
          </li>
        ))}
      </ul>

      <div className="submit-wrapper">
        <button type="submit" disabled={isFormInvalid}>
          Submit app to continue on Credible
        </button>
      </div>

      <span id="submit-msg" className={attempted && !success ? 'warning' : ''}>
        {submitting
          ? '...submitting application'
          : attempted &&
            (success
              ? `Successfully started an application! Check ${email.value} for the link to resume the Credible Insurance application.`
              : 'Failed to submit the application. Please check the network tab and console to understand the issue.')}
      </span>
    </form>
  )
}

export default StarterForm
