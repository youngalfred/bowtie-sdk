import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WindMitigationComponent } from './wind-mitigation.component'

describe('WindMitigationComponent', () => {
  let component: WindMitigationComponent
  let fixture: ComponentFixture<WindMitigationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WindMitigationComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WindMitigationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
