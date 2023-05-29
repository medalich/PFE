import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IChargeJournaliere } from '../charge-journaliere.model';
import { ChargeJournaliereService } from '../service/charge-journaliere.service';

import { ChargeJournaliereRoutingResolveService } from './charge-journaliere-routing-resolve.service';

describe('ChargeJournaliere routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChargeJournaliereRoutingResolveService;
  let service: ChargeJournaliereService;
  let resultChargeJournaliere: IChargeJournaliere | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ChargeJournaliereRoutingResolveService);
    service = TestBed.inject(ChargeJournaliereService);
    resultChargeJournaliere = undefined;
  });

  describe('resolve', () => {
    it('should return IChargeJournaliere returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChargeJournaliere = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChargeJournaliere).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChargeJournaliere = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChargeJournaliere).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IChargeJournaliere>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChargeJournaliere = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChargeJournaliere).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
