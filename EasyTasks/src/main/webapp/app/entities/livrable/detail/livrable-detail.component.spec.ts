import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LivrableDetailComponent } from './livrable-detail.component';

describe('Livrable Management Detail Component', () => {
  let comp: LivrableDetailComponent;
  let fixture: ComponentFixture<LivrableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivrableDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ livrable: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LivrableDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LivrableDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load livrable on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.livrable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
