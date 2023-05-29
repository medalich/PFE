import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MaintenanceService } from '../service/maintenance.service';

import { MaintenanceComponent } from './maintenance.component';

describe('Maintenance Management Component', () => {
  let comp: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let service: MaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'maintenance', component: MaintenanceComponent }]), HttpClientTestingModule],
      declarations: [MaintenanceComponent],
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
      .overrideTemplate(MaintenanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MaintenanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MaintenanceService);

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
    expect(comp.maintenances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to maintenanceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMaintenanceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMaintenanceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
