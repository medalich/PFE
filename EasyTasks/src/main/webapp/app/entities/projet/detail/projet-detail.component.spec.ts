import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjetDetailComponent } from './projet-detail.component';

describe('Projet Management Detail Component', () => {
  let comp: ProjetDetailComponent;
  let fixture: ComponentFixture<ProjetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ projet: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProjetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProjetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load projet on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.projet).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
