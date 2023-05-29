import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstimationService } from '../service/estimation.service';

import { EstimationComponent } from './estimation.component';

describe('Estimation Management Component', () => {
  let comp: EstimationComponent;
  let fixture: ComponentFixture<EstimationComponent>;
  let service: EstimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'estimation', component: EstimationComponent }]), HttpClientTestingModule],
      declarations: [EstimationComponent],
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
      .overrideTemplate(EstimationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstimationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstimationService);

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
    expect(comp.estimations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to estimationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEstimationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEstimationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
