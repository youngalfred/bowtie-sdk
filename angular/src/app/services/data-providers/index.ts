import { AutoMakesDataService } from '@youngalfred/bowtie-sdk';
import { HomePropertyDataService } from '@youngalfred/bowtie-sdk';
import { AutoModelsDataService } from '@youngalfred/bowtie-sdk';
import { OptionType } from '@youngalfred/bowtie-sdk';
import { InputFieldType } from '@youngalfred/bowtie-sdk';
import { AutoIdentityDataService } from '@youngalfred/bowtie-sdk';
import { AutoBodyTypesDataService } from '@youngalfred/bowtie-sdk';
import { AutoBodyTypesArgs, AutoIdentity, AutoIdentityArgs, AutoMakesArgs, AutoModelsArgs } from '@youngalfred/bowtie-sdk/build/third-party/auto/types';
import { autoBodyTypes, autoIdentity, autoMakes, autoModels, homePropertyData } from './sample-data';
import { waitUpToXSeconds } from './utils';

/**
 * We recommend you use our pre-built Bowtie data services that can be imported from the @younglafred/bowtie-sdk.
 * They are the simplest to integrate with and require no extra work on your behalf besides forwarding the auto and property requests from your
 * proxy server to the Bowtie API. The Bowtie data services also provide out-of-the-box functionality for retrying failed requests
 * (you can also specify which http error codes to retry requests).
 * 
 * However, if you wish to source your auto or home property data from somewhere besides the Bowtie API, you have the option to extend or instantiate
 * the base DataService classes, which can also be imported from the sdk. All that's required is that the return value of your
 * data fetcher function(s) conform to the sdk's expected return type. For the AutoIdentityDataService class, this means that your
 * getAutoByVin function must return an AutoIdentity (see the type for more details) OR an empty object to trigger a no-op.
 * 
 * Also note that each data fetcher function accepts an abort controller as an argument that you can attach to your http client
 * so the sdk can signal when to cancel certain requests. For example, if a customer is manually inputting his/her address,
 * you will most likely want to complete only the most recent request for home property information that was triggered by
 * a change to the customer's address.
 * 
 * Examples of how to attach the abort controller signal to some common http clients:
 * - fetch: await fetch(url, { signal: abortController.signal });
 * - axios: await axios({ method, url, signal: abortController.signal })
 * 
 * (take a look at the network tab and watch for certain requests to turn red and say "CANCELED" to verify
 * that the controller signal is attaching correctly.)
 */

export const customAutoBodyTypeDataService = new AutoBodyTypesDataService({
    getBodyTypesByMakeModelAndYear: async ({
        year,
        make,
        model,
        abortController,
    }: AutoBodyTypesArgs): Promise<OptionType[]> => {
        // Of course, you'll need to use the year, make, model to retrieve body type options from an external service.
        // For this example, we'll just return static, dummy data (after simulating a long-running network request),
        // and that's why we're disregarding the "getBodyTypesByMakeModelAndYear" arguments.
        await waitUpToXSeconds(2);
        return autoBodyTypes;
    }
})

export const customAutoIdentityDataService = new AutoIdentityDataService({
    getAutoByVin: async ({ vinNumber, abortController }: AutoIdentityArgs): Promise<AutoIdentity|{}> => {
        await waitUpToXSeconds(2);
        return autoIdentity;
    }
})

export const customAutoMakesDataService = new AutoMakesDataService({
    getMakesByYear: async ({ year, abortController }: AutoMakesArgs): Promise<OptionType[]> => {
        await waitUpToXSeconds(2);
        return autoMakes;
    }
})

export const customAutoModelsDataService = new AutoModelsDataService({
    getModelsByMakeAndYear: async ({ year, make, abortController }: AutoModelsArgs): Promise<OptionType[]> => {
        await waitUpToXSeconds(2);
        return autoModels;
    }
})

export const customHomePropertyDataService = new HomePropertyDataService({
    getHomeProperty: async ({ address, abortController }): Promise<Record<string, InputFieldType["hints"]>> => {
        await waitUpToXSeconds(2);
        return homePropertyData;
    }
})