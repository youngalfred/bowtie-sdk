import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http';
import { Portfolio, BowtieSdkConfig, SubmitError, ISubmitResult } from "@youngalfred/bowtie-sdk";
import { Fieldgroup, Node, SDKField, SDKFieldGroup, SDKInputField } from 'src/types';
import { makeTestId } from 'src/utilities/modifiers/groups';
import { combineClasses } from './shared/fields';
import { getSideEffectFor } from 'src/utilities/async-fields';
import modifyField from 'src/utilities/modifiers/fields';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'bowtie-sdk-angular-12-demo';
  private base = 'http://localhost:3001';

  private bowtieConfig: BowtieSdkConfig = {
    // we provide defaults values for the below endpoints,
    // but feel free to customize as desired:
    apiUrls: {
      submit: `${this.base}/portfolio/submit`,
      getAutoByVin: `${this.base}/auto/vin/`, // notice the trailing "/"
      getAutoMakesByYear: `${this.base}/auto/makes`,
      getAutoModelsByYearAndMake: `${this.base}/auto/models`,
      getAutoBodyTypesByYearMakeAndModel: `${this.base}/auto/bodystyles`
    },
    /**
     * The sdk will retry failed requests (for the above api endpoints)
     * three times at most (after the initial failure) when one of the following conditions is met:
     * - an http error code that you specified in the retryErrorCodes section below is received
     * - the request fails to send
     * - no response is received (timeout)
     */
    retryErrorCodes: {
      submit: [500, 503, 504], // please do not retry when the bowtie api returns a 400 error
      /**
       * By omitting retry codes for the following endpoints,
       * you are signaling not to retry failed requests for said endpoints:
       * 
       * - getAutoByVin: [],
       * - getAutoMakesByYear: [],
       * - getAutoModelsByYearAndMake: [],
       * - getAutoBodyTypesByYearMakeAndModel: [],
       */
    }
  }
  public portfolio: Portfolio;
  public invalidFieldsAreHighlighted: boolean = false;
  public isPortolioSubmitted: boolean = false;
  public portfolioId: string = "";

  private hiddenFieldGroups: Set<string> = new Set([
    // "policy-type" // hide "policy-type" if you want to provide only home insurance 
  ]);

  // Provide your own dynamic data to prefill the
  // portfolio in the constructor OR ngOnInit()
  private prefilledFields: Record<string, string> = {
    // "start.policyType": "home",
    // "start.zipCode": "33020",
    // "start.city": "Seattle",
    // "start.state": "MA",
    // "start.firstName": "Alfred",
    // "start.lastName": "Butler",
    // "start.streetAddress": "123 Main Street",
    // "start.emailAddress": "alfred@youngalfred.com",
    // "home.hasOccupants._adults": "1",
    // "home.occupants.adults": "n1",
    // "home.email": "alfred@youngalfred.com",
    // "home.primaryPolicyHolder.birthDate": "1980-05-17",
    // "home.primaryPolicyHolder.gender": "male",
    // "home.primaryPolicyHolder.maritalStatus": "separated",
    // "home.primaryPolicyHolder.careerStatus": "employed",
    // "home.primaryPolicyHolder.occupation": "photographerOrPhotographyStudio",
    // "home.secondaryPolicyHolder": "yes",
    // "home.propertyType": "House",
    // "home.propertyStyle": "duplex",
    // "home.propertyUse.typeOfUse": "primary",
    // "home.propertyUse.isShortTermRental": "no",
    // "home.plan.requestedPolicyStart": "on",
    // "home.plan.requestedPolicyStartDate": "2021-08-10",
    // "home.dateOfPurchase": "1999-01-01",
    // "home.numberOfMortgages": "n1",
  };

  ngOnInit() { }

  // Retrieve the localstorage application,
  // which may not exist
  maybeLocalstore = () => {
    try {
      const application = window.localStorage.getItem("bowtie_sdk_demo");
      return JSON.parse(application ? application : "{}");
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  // When the destination field components call updateField() with a new value,
  // the UI re-renders with the updated portfolio
  updateField = (fieldname = "") => (value = "") => {
    const field = this.portfolio.find(fieldname) as SDKInputField;
    if (field && field.value !== value) {
      this.portfolio.set(field, value);
      window.localStorage.setItem("bowtie_sdk_demo", JSON.stringify(this.portfolio.application));
    }
  };

  propsReducer = (acc: Node[], child: SDKField): Node[] => {
    // Do not render prefilled or hidden fields
    if (child.kind === "hidden") {
      return acc;
    }

    const { kind, children = [], ...groupRest } = child as SDKFieldGroup;
    // reduce the multigroup/fieldgroup's children (they need an onChange event handler and stringified classes)
    if (["multigroup", "fieldgroup"].includes(kind)) {
      return [
        ...acc,
        {
          ...groupRest,
          kind,
          classes: combineClasses(child, this.invalidFieldsAreHighlighted),
          children: children.reduce(this.propsReducer, [])
        }
      ];
    }

    const { id, ...rest } = child as SDKInputField;
    if (rest.kind === "hidden") {
      throw new Error(`Hidden field (${id}) is not meant to be rendered.`)
    }

    return [
      ...acc,
      modifyField({
        ...rest,
        id,
        classes: combineClasses(child, this.invalidFieldsAreHighlighted),
        testId: makeTestId(id),
        onChange: this.updateField(id),
        applySideEffect: getSideEffectFor(this.portfolio, { id, ...rest }),
      }, { uploadFiles: this.httpService.uploadFiles })
    ];
  };

  // Filter out any questions that shouldn't be rendered
  // and add event handlers to the individual fields
  makeFieldGroups = (portfolio: Portfolio): Fieldgroup[] => {
    return portfolio.view.reduce((acc: Fieldgroup[], fg: SDKFieldGroup): Fieldgroup[] => {
      // Filter out any fieldgroups you wish to hide
      if (this.hiddenFieldGroups.has(fg.id)) {
        return acc;
      }

      return [
        ...acc,
        {
          ...fg,
          classes: combineClasses(fg, this.invalidFieldsAreHighlighted),
          children: fg.children.reduce(this.propsReducer, [])
        }
      ];
    }, []);
  };

  // Initialize fieldgroup questions based on the (possibly empty) portfolio
  constructor(private httpService: HttpService) {
    this.portfolio = new Portfolio({
      ...this.bowtieConfig,
      application: this.maybeLocalstore()
    });

    // Optional: prefill aspects of the portfolio here.
    // You will likely require a "mapper" to bridge the gap between
    // your existing data and YA's portfolio ids
    Object.entries(this.prefilledFields).forEach(([fieldname, prefilledValue]) => {
      this.updateField(fieldname)(prefilledValue);
    });
  }

  // Once the portfolio has been completely filled out,
  // submit the application to your proxy server (and then to the api with your api key)
  submit = async () => {
    const data = this.portfolio.payload;

    try {
      const { portfolioId = "", message }: ISubmitResult = await this.portfolio.submit({
        headers: {
          // any headers you might want to send to your proxy server
        }
      });
      this.isPortolioSubmitted = true;
      this.portfolioId = portfolioId;
      console.log({ message });
    } catch (err: any) {
      const error = err as SubmitError;
      console.error(error);
    }
  }

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: Node) => item.id;

}
