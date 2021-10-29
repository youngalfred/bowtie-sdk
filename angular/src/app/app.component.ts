import { Component, OnInit } from '@angular/core';
import { HttpService } from './services';
import { Portfolio, FieldType, InputFieldType, FieldGroup } from "@youngalfred/bowtie-sdk";
import { AppFieldGroup, GroupOrField } from 'src/types';
import { makeTestId } from 'src/utilities/groupModifiers';
import { combineClasses } from './shared/fields';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'bowtie-sdk-angular-12-demo';

  public portfolio: Portfolio;
  public invalidFieldsAreHighlighted: boolean = false;
  public isPortolioSubmitted: boolean = false;
  public portfolioId: string = "";
  private token: string = "";

  // These objects can be customized for your own purposes 
  // to update the portfolio within the constructor 
  // (but are only used currently to prevent field groups and questions from being displayed)
  private hiddenFieldGroups: Set<string> = new Set([
    // "policy-type"
  ]);
  // Of course, you will receive the prefilledData data dynamically, 
  // instead of having it hard coded, but the principles for
  // prefilling the portofilio are the same:
  // Use the prefilledFields data to update the portfolio in 
  // the constructor OR ngOnInit()
  private prefilledFields: Record<string, string> = {
    "start.policyType": "home",
    "start.zipCode": "33020",
    "start.city": "Seattle",
    "start.state": "MA",
    "start.firstName": "Alfred",
    "start.lastName": "Butler",
    "start.streetAddress": "123 Main Street",
    "start.emailAddress": "alfred@youngalfred.com",
    "home.hasOccupants._adults": "1",
    "home.occupants.adults": "n1",
    "home.email": "alfred@youngalfred.com",
    "home.primaryPolicyHolder.birthDate": "1980-05-17",
    "home.primaryPolicyHolder.gender": "male",
    "home.primaryPolicyHolder.maritalStatus": "separated",
    "home.primaryPolicyHolder.careerStatus": "employed",
    "home.primaryPolicyHolder.occupation": "photographerOrPhotographyStudio",
    "home.secondaryPolicyHolder": "yes",
    "home.propertyType": "House",
    "home.propertyStyle": "duplex",
    "home.propertyUse.typeOfUse": "primary",
    "home.propertyUse.isShortTermRental": "no",
    "home.plan.requestedPolicyStart": "on",
    "home.plan.requestedPolicyStartDate": "2021-08-10",
    "home.dateOfPurchase": "1999-01-01",
    "home.numberOfMortgages": "n1",
  };

  ngOnInit() {
    this.token = new URLSearchParams(window.location.search).get("integration") || "";
  }

  // Retrieve the localstorage application, 
  // which is possibly non-existent
  maybeLocalstore = () => {
    try {
      const application = window.localStorage.getItem("young_alfred");
      return JSON.parse(application ? application : "{}");
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  // When the destination field components call updateField() with a new value,
  // the UI re-renders with the updated portfolio
  updateField = (fieldname = "") => (value = "") => {
    const field = this.portfolio.find(fieldname) as InputFieldType;
    if (field && field.value !== value) {
      this.portfolio.set(field, value);
      window.localStorage.setItem("young_alfred", JSON.stringify(this.portfolio.application));
    }
  };

  propsReducer = (acc: GroupOrField[], child: FieldType): GroupOrField[] => {
    // Do not render prefilled or hidden fields
    if (child.kind === "hidden") {
      return acc;
    }

    const { kind = "", children = [], ...groupRest } = child as FieldGroup;
    // reduce the multigroup/fieldgroup's children (they need an onChange event handler and stringified classes)
    if (["multigroup", "fieldgroup"].includes(kind)) {
      return [...acc,
      {
        ...groupRest,
        kind,
        classes: combineClasses(child, this.invalidFieldsAreHighlighted),
        children: children.reduce(this.propsReducer, [])
      }];
    }

    const { id = "", ...rest } = child as InputFieldType;
    return [
      ...acc,
      {
        ...rest,
        id,
        classes: combineClasses(child, this.invalidFieldsAreHighlighted),
        testId: makeTestId(id),
        onChange: this.updateField(id)
      }
    ];
  };

  // Filter out any questions that shouldn't be rendered
  // and add event handlers to the individual fields
  makeFieldGroups = (portfolio: Portfolio) => {
    return portfolio.view.reduce((acc: AppFieldGroup[], fg: FieldGroup): AppFieldGroup[] => {
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
    }, [] as AppFieldGroup[]);
  };

  // Initialize fieldgroup questions based on the (possibly empty) portfolio
  constructor(private httpService: HttpService) {
    this.portfolio = new Portfolio(this.maybeLocalstore());

    // Optional: prefill aspects of the portfolio here.
    // You will likely require a "mapper" to bridge the gap between
    // your existing data and YA's portfolio ids
    Object.entries(this.prefilledFields).forEach(([fieldname, prefilledValue]) => {
      this.updateField(fieldname)(prefilledValue);
    });
  }

  // Once the portfolio has been completely filled out,
  // submit the application using your api key from the express server
  submit = () => {
    const data = this.portfolio.payload;
    const headers = {
      "x-integration-token": this.token,
    };

    this.httpService.submit(data, headers)
      .subscribe(resp => {
        this.isPortolioSubmitted = true;
        console.log("Submit response: ", resp);
        this.portfolioId = resp.portfolioId;
      }, err => {
        console.error(err);
      });
  }

  getPortfolioStatus() {
    this.httpService.getPortfolioStatus(this.portfolioId, this.token)
      .subscribe(resp => {
        console.log(resp);
      }, err => {
        console.error("Couldn't get portfolio status", err);
      });

      this.httpService.getPortfolio(this.portfolioId, this.token)
      .subscribe(resp => {
        console.log(resp);
      }, err => {
        console.error("Couldn't get portfolio object", err);
      });
  }

  // Necessary to maintain focus on text fields 
  // when typing
  trackBy = (_: number, item: GroupOrField) => item.id;

}
