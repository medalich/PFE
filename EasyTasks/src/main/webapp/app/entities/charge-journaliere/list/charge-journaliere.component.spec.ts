import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChargeJournaliereService } from '../service/charge-journaliere.service';

import { ChargeJournaliereComponent } from './charge-journaliere.component';

describe('ChargeJournaliere Management Component', () => {
  let comp: ChargeJournaliereComponent;
  let fixture: ComponentFixture<ChargeJournaliereComponent>;
  let service: ChargeJournaliereService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'charge-journaliere', component: ChargeJournaliereComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ChargeJournaliereComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ChargeJournaliereComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChargeJournaliereComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChargeJournaliereService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.chargeJournalieres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to chargeJournaliereService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getChargeJournaliereIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChargeJournaliereIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
