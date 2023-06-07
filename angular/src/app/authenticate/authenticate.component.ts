import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BowtieAuthSession, BowtieCredentials, authenticateSession } from '@youngalfred/bowtie-sdk';
import { Field, Fieldgroup } from 'src/types';

@Component({
  selector: 'authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent {

  public email: string = ''
  public birthDate: string = ''
  get validEmail() { return this.email.length > 3 }
  get validISOPatternBday() {return  /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(this.birthDate) }
  get touched() {
    return {
      email: false,
      birthDate: false
    }
  }

  get disabled() {
    return this.fg.children.some(c => !(c as Field).valid?.valid)
  }

  get fg(): Fieldgroup {
    return {

      id: 'authentication-fg',
      kind: 'fieldgroup',
      label: 'To continue, please verify the email address and date of birth entered on your application.',
      classes: '',
      decoration: {},
      children: [
        {
          id: 'email',
          testId: 'authenticate-email',
          kind: 'text',
          label: 'Email Address',
          value: this.email,
          valid: { valid: this.validEmail, msg: this.touched.email ? 'Please enter a valid email' : '' }, 
          onChange: v => {
              this.email = v
              this.touched.email =true
          },
          classes: '',
        },
        {
            id: 'birthDate',
            kind: 'text',
            label: 'Birth Date (YYYY-MM-DD)',
            value: this.birthDate,
            testId: 'authenticate-email',
            valid:  { valid: this.validISOPatternBday, msg: this.touched.birthDate ? 'Please enter a valid birth date' : '' },
            onChange: v => {
                this.birthDate = v
                this.touched.birthDate = true
            },
            classes: '',
        }
      ],
    }
  }

  @Input('submit') submit?: (email: string, birthDate: string) => Promise<void>
  

  constructor() { }

  handleSubmit(e: Event) {
    e.preventDefault()

    const inputs = (e.target as HTMLFormElement).getElementsByTagName('input')
    const { email, birthDate } = Array.from(inputs).reduce((acc, next) => ({
        ...acc,
        [next.getAttribute('id') ?? '']: next.value
      }), {} as BowtieCredentials)
    
    this.submit?.(email, birthDate)
  }

}
