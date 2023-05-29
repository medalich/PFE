import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LivrableService } from '../service/livrable.service';

import { LivrableComponent } from './livrable.component';

describe('Livrable Management Component', () => {
  let comp: LivrableComponent;
  let fixture: ComponentFixture<LivrableComponent>;
  let service: LivrableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'livrable', component: LivrableComponent }]), HttpClientTestingModule],
      declarations: [LivrableComponent],
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
      .overrideTemplate(LivrableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivrableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LivrableService);

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
    expect(comp.livrables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to livrableService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLivrableIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLivrableIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
