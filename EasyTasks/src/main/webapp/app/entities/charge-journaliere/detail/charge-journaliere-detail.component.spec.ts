import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChargeJournaliereDetailComponent } from './charge-journaliere-detail.component';

describe('ChargeJournaliere Management Detail Component', () => {
  let comp: ChargeJournaliereDetailComponent;
  let fixture: ComponentFixture<ChargeJournaliereDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargeJournaliereDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chargeJournaliere: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChargeJournaliereDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChargeJournaliereDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chargeJournaliere on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chargeJournaliere).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
