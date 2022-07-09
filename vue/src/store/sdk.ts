import type { SDKInputField } from '@/types';
import Portfolio from '@youngalfred/bowtie-sdk';
import { computed, reactive } from 'vue'

// const app = reactive<{portfolio: Portfolio, updateField: (a: string) => (b: string) => void}>({
    //         portfolio: new Portfolio(),
    //         updateField(fieldname = "") {
            
    //             return function(value = "") {
    //                 const field = app.portfolio.find(fieldname) as SDKInputField;
    
    //                 if (field && field.value !== value) {
    //                     app.portfolio.set(field, value);
    //                     console.log('updated ' + field.id)
    //                     // window.localStorage.setItem("bowtie_sdk_demo", JSON.stringify(me.portfolio.application));
    //                 }
    //             };
    //         }
    //     })