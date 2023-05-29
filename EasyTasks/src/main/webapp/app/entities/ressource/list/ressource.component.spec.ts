import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RessourceService } from '../service/ressource.service';

import { RessourceComponent } from './ressource.component';

describe('Ressource Management Component', () => {
  let comp: RessourceComponent;
  let fixture: ComponentFixture<RessourceComponent>;
  let service: RessourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'ressource', component: RessourceComponent }]), HttpClientTestingModule],
      declarations: [RessourceComponent],
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
      .overrideTemplate(RessourceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RessourceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RessourceService);

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
    expect(comp.ressources?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to ressourceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRessourceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRessourceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
