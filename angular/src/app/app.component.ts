import { Component, OnInit } from '@angular/core'
import { HttpService } from './services/http'
import {
  Portfolio,
  BowtieSdkConfig,
  SubmitError,
  ISubmitResult,
  startBowtieSession,
  PortfolioUpdatedCallback,
  BowtieHomePropertyDataService,
  BowtieAutoIdentityDataService,
  BowtieAutoMakesDataService,
  BowtieAutoModelsDataService,
  BowtieAutoBodyTypesDataService,
} from '@youngalfred/bowtie-sdk'
import { Node, SDKField, SDKFieldGroup, SDKInputField } from 'src/types'
import { combineClasses } from './shared/fields'
import { SESSION_ID, getCookies } from 'src/utilities/cookie'
import modifyField from 'src/utilities/modifiers/fields'
import { makeTestId, modifyFieldGroup } from 'src/utilities/modifiers/groups'
import { prefilledFields } from '../data/home-prefill-example'
import { hiddenFieldGroups } from 'src/data/hidden-field-groups'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'bowtie-sdk-angular-12-demo'
  private base = 'http://localhost:3001/'

  public invalidFieldsAreHighlighted: boolean = false
  public checkingForStoredApplication: boolean = true
  public isPortolioSubmitted: boolean = false
  public portfolioId: string = ''

  /**
   * You may hide "policy-type", for example,
   * if you want to provide only home insurance.
   * Keep in mind, you'd also need to prefill the
   * start.policyType field with "home".
   */
  private hiddenFieldGroups: Set<string> = new Set(hiddenFieldGroups)

  /**
   * Provide your own dynamic data to prefill the
   * portfolio in the constructor OR ngOnInit();
   * Uncomment prefilledFields below to see the portfolio pre-populated.
   */
  private prefilledFields: Record<string, string> = prefilledFields

  /**
   * Portfolio
   */
  public portfolio: Portfolio = new Portfolio() // overwritten onInit

  /**
   * Portfolio helper methods
   */
  private bowtieConfig = (sessionId: string): BowtieSdkConfig => ({
    onPortfolioUpdated: this.onPortfolioUpdated,
    dataFillServices: {
      autoIdentityDataService: new BowtieAutoIdentityDataService({
        url: `${this.base}auto/vin/`,
      }),
      autoMakesDataService: new BowtieAutoMakesDataService({
        url: `${this.base}auto/makes`,
      }),
      autoModelsDataService: new BowtieAutoModelsDataService({
        url: `${this.base}auto/models`,
      }),
      autoBodyTypesDataService: new BowtieAutoBodyTypesDataService({
        url: `${this.base}auto/bodystyles`,
      }),
      homePropertyDataService: new BowtieHomePropertyDataService({
        url: `${this.base}property`,
      }),
    },
    partialUpdateOptions: {
      // configure the sdk send partial portfolio updates
      // as the customer completes the form. That way no
      // custoemr progress is lost if/when they resume the app later.
      sendPartialUpdates: true,
      url: `${this.base}session/${sessionId ?? ''}/progress`,
      handleError: (_err: unknown) => null,
    },
  })

  private onPortfolioUpdated: PortfolioUpdatedCallback = (
    _error: unknown,
    portfolio: Portfolio,
  ) => {
    // The portfolio needs to be overwritten even if an error occurs
    // (such as when select fields become text fields due
    // to a data service erroring out).
    this.portfolio = portfolio
  }

  /**
   *
   * Constructor, onInit methods (+ portfolio & session helpers) used to configure
   * the portfolio object with the desired settings as well as with an
   * optional partial application (stored in and read from the Bowtie API).
   */

  constructor(private httpService: HttpService) {}

  async ngOnInit(): Promise<void> {
    let sessionId: string = getCookies()[SESSION_ID] ?? ''

    if (!sessionId) {
      // Create new session
      const { sessionId: newSessionId } = await startBowtieSession({ url: `${this.base}session` })

      this.updateSessionId(newSessionId)
      this.portfolio = new Portfolio({
        ...this.bowtieConfig(newSessionId),
        application: this.maybeLocalstore(),
      })
      this.checkingForStoredApplication = false

      // return early as no partial app exists in the backend yet
      // (the session was just now created)
      return
    }

    // Resume the partial portfolio associated with the session
    const application = (await this.httpService.getPartialPortfolio(sessionId)) ?? {}

    this.portfolio = new Portfolio({
      ...this.bowtieConfig(sessionId),
      application,
    })
    this.checkingForStoredApplication = false

    // Optional: prefill aspects of the portfolio here.
    // You will likely require a "mapper" to map your data's ids
    // to the tlano-sdk's portfolio ids (customer.email -> start.emailAddress)
    // Object.entries(this.prefilledFields).forEach(([fieldname, prefilledValue]) => {
    //   this.updateField(fieldname)(prefilledValue)
    // })
  }

  private updateSessionId(id: string) {
    // Remember the Bowtie Session Id to resume it later
    document.cookie = `${SESSION_ID}=${id}`
  }

  private maybeLocalstore = () => {
    try {
      const application = window.localStorage.getItem('bowtie_sdk_demo')
      return JSON.parse(application ? application : '{}')
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  /**
   * Methods to help build the stateful HTML view
   * (by adding decorations, event listeners, and field/group modifiers).
   *
   * Note: when the destination field components (input, select, etc..)
   * invoke updateField(newValue), the UI will automatically re-render
   * the updated portfolio.
   */
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
      const reducedChildren = children.reduce(this.fieldReducer, [])
      if (reducedChildren.length === 0) {
        return acc
      }

      return [
        ...acc,
        modifyFieldGroup({
          ...groupRest,
          kind: 'fieldgroup', // notice that multigroups become fieldgroups
          classes: combineClasses(field, this.invalidFieldsAreHighlighted),
          children: reducedChildren,
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
        },
        { uploadFiles: this.httpService.uploadFiles },
      ),
    ]
  }

  makeFieldGroups = (portfolio: Portfolio): Node[] =>
    portfolio.view.reduce(this.fieldReducer, [] as Node[])

  // Once the portfolio has been completely filled out,
  // submit the application to your proxy server (and then to the api with your api key)
  submit = async () => {
    try {
      const { portfolioId = '', message }: ISubmitResult = await this.portfolio.submit({
        url: 'api/v1/submit ',
        headers: {
          // any headers you might want to send to your proxy server
        },
      })
      this.isPortolioSubmitted = true
      this.updateSessionId('') // reset
      window.localStorage.removeItem('bowtie_sdk_demo')
      this.portfolioId = portfolioId
      console.log({ message })
    } catch (err: any) {
      const error = err as SubmitError
      console.error(error)
    }
  }

  newApplication = window.location.reload

  /**
   * Necessary to maintain focus on text fields
   * when typing (compare to the "key" attribute used in React during list.map()).
   */
  trackBy = (_: number, item: Node) => item.id
}
