import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { LabelComponent } from './label/label.component';
import { FieldGroupComponent } from './field-group/field-group.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { HttpClientModule } from '@angular/common/http';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { InfoHoverComponent } from './info-hover/info-hover.component';
@NgModule({
  declarations: [
    AppComponent,
    TextFieldComponent,
    SelectFieldComponent,
    LabelComponent,
    FieldGroupComponent,
    CheckboxFieldComponent,
    RadioFieldComponent,
    InfoHoverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
