import { Component, OnInit } from '@angular/core'
import { HttpService } from './services/http'
import { Portfolio, BowtieSdkConfig, SubmitError, ISubmitResult } from '@youngalfred/bowtie-sdk'
import { Node, SDKField, SDKFieldGroup, SDKInputField } from 'src/types'
import { combineClasses } from './shared/fields'
import { getSideEffectFor } from 'src/utilities/async-fields'
import modifyField from 'src/utilities/modifiers/fields'
import { makeTestId, modifyFieldGroup } from 'src/utilities/modifiers/groups'
import { prefilledFields } from '../data/home-prefill-example'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'bowtie-sdk-angular-12-demo'
  private base = 'http://localhost:3001'

  private bowtieConfig: BowtieSdkConfig = {
    // we provide defaults values for the below endpoints,
    // but feel free to customize as desired:
    apiUrls: {
      submit: `${this.base}/portfolio/submit`,
      getAutoByVin: `${this.base}/auto/vin/`, // notice the trailing "/"
      getAutoMakesByYear: `${this.base}/auto/makes`,
      getAutoModelsByYearAndMake: `${this.base}/auto/models`,
      getAutoBodyTypesByYearMakeAndModel: `${this.base}/auto/bodystyles`,
    },
    /**
     * The sdk will retry failed requests (for the above api endpoints)
     * three times at most (after the initial failure) when one of the following conditions is met:
     * - an http error code that you specified in the retryErrorCodes section below is received
     * - the request fails to send
     * - no response is received (timeout)
     */
    retryErrorCodes: {
      submit: [500, 503, 504],
      /**
       * By omitting retry codes for the following endpoints,
       * you are signaling not to retry requests that complete
       * with an http error code:
       *
       * - getAutoByVin: [],
       * - getAutoMakesByYear: [],
       * - getAutoModelsByYearAndMake: [],
       * - getAutoBodyTypesByYearMakeAndModel: [],
       */
    },
  }
  public portfolio: Portfolio
  public invalidFieldsAreHighlighted: boolean = false
  public isPortolioSubmitted: boolean = false
  public portfolioId: string = ''

  // you may hide "policy-type", for example, if you want to provide only home insurance
  private hiddenFieldGroups: Set<string> = new Set([
    // "policy-type"
  ])

  // Provide your own dynamic data to prefill the
  // portfolio in the constructor OR ngOnInit();
  // Uncomment prefilledFields below to see the portfolio pre-populated.
  private prefilledFields: Record<string, string> = prefilledFields

  ngOnInit() {}

  // Retrieve the localstorage application,
  // which may or may not exist
  maybeLocalstore = () => {
    try {
      const application = window.localStorage.getItem('bowtie_sdk_demo')
      return JSON.parse(application ? application : '{}')
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  // When the destination field components call updateField() with a new value,
  // the UI re-renders with the updated portfolio
  updateField =
    (fieldname = '') =>
    (value = '') => {
      const field = this.portfolio.find(fieldname) as SDKInputField
      if (field && field.value !== value) {
        this.portfolio.set(field, value)
        window.localStorage.setItem('bowtie_sdk_demo', JSON.stringify(this.portfolio.application))
      }
    }

  fieldReducer = (acc: Node[], field: SDKField): Node[] => {
    // Do not render prefilled or hidden fields;
    // Filter out any fieldgroups you wish to hide
    if (field.kind === 'hidden' || this.hiddenFieldGroups.has(field.id)) {
      return acc
    }

    const { kind, children = [], ...groupRest } = field as SDKFieldGroup
    // reduce the multigroup/fieldgroup's children (they need an onChange event handler and stringified classes)
    if (['multigroup', 'fieldgroup'].includes(kind)) {
      return [
        ...acc,
        modifyFieldGroup({
          ...groupRest,
          kind: 'fieldgroup', // notice that multigroups become fieldgroups
          classes: combineClasses(field, this.invalidFieldsAreHighlighted),
          children: children.reduce(this.fieldReducer, []),
        }),
      ]
    }

    const { id, ...rest } = field as SDKInputField
    if (rest.kind === 'hidden') {
      throw new Error(`Hidden field (${id}) is not meant to be rendered.`)
    }

    return [
      ...acc,
      modifyField(
        {
          ...rest,
          id,
          classes: combineClasses(field, this.invalidFieldsAreHighlighted),
          testId: makeTestId(id),
          onChange: this.updateField(id),
          applySideEffect: getSideEffectFor(this.portfolio, { id, ...rest }),
        },
        { uploadFiles: this.httpService.uploadFiles },
      ),
    ]
  }

  makeFieldGroups = (portfolio: Portfolio): Node[] =>
    portfolio.view.reduce(this.fieldReducer, [] as Node[])

  // Initialize fieldgroup questions based on the (possibly empty) portfolio
  constructor(private httpService: HttpService) {
    this.portfolio = new Portfolio({
      ...this.bowtieConfig,
      application: this.maybeLocalstore(),
    })

    // Optional: prefill aspects of the portfolio here.
    // You will likely require a "mapper" to bridge the gap between
    // your existing data and YA's portfolio ids
    Object.entries(this.prefilledFields).forEach(([fieldname, prefilledValue]) => {
      this.updateField(fieldname)(prefilledValue)
    })
  }

  // Once the portfolio has been completely filled out,
  // submit the application to your proxy server (and then to the api with your api key)
  submit = async () => {
    try {
      const { portfolioId = '', message }: ISubmitResult = await this.portfolio.submit({
        headers: {
          // any headers you might want to send to your proxy server
        },
      })
      this.isPortolioSubmitted = true
      this.portfolioId = portfolioId
      console.log({ message })
    } catch (err: any) {
      const error = err as SubmitError
      console.error(error)
    }
  }

  // Necessary to maintain focus on text fields
  // when typing
  trackBy = (_: number, item: Node) => item.id
}
