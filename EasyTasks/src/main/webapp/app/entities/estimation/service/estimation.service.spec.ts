import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEstimation } from '../estimation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../estimation.test-samples';

import { EstimationService, RestEstimation } from './estimation.service';

const requireRestSample: RestEstimation = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Estimation Service', () => {
  let service: EstimationService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstimation | IEstimation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstimationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Estimation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const estimation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estimation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estimation', () => {
      const estimation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estimation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estimation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estimation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estimation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstimationToCollectionIfMissing', () => {
      it('should add a Estimation to an empty array', () => {
        const estimation: IEstimation = sampleWithRequiredData;
        expectedResult = service.addEstimationToCollectionIfMissing([], estimation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimation);
      });

      it('should not add a Estimation to an array that contains it', () => {
        const estimation: IEstimation = sampleWithRequiredData;
        const estimationCollection: IEstimation[] = [
          {
            ...estimation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstimationToCollectionIfMissing(estimationCollection, estimation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estimation to an array that doesn't contain it", () => {
        const estimation: IEstimation = sampleWithRequiredData;
        const estimationCollection: IEstimation[] = [sampleWithPartialData];
        expectedResult = service.addEstimationToCollectionIfMissing(estimationCollection, estimation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimation);
      });

      it('should add only unique Estimation to an array', () => {
        const estimationArray: IEstimation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estimationCollection: IEstimation[] = [sampleWithRequiredData];
        expectedResult = service.addEstimationToCollectionIfMissing(estimationCollection, ...estimationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estimation: IEstimation = sampleWithRequiredData;
        const estimation2: IEstimation = sampleWithPartialData;
        expectedResult = service.addEstimationToCollectionIfMissing([], estimation, estimation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimation);
        expect(expectedResult).toContain(estimation2);
      });

      it('should accept null and undefined values', () => {
        const estimation: IEstimation = sampleWithRequiredData;
        expectedResult = service.addEstimationToCollectionIfMissing([], null, estimation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimation);
      });

      it('should return initial array if no Estimation is added', () => {
        const estimationCollection: IEstimation[] = [sampleWithRequiredData];
        expectedResult = service.addEstimationToCollectionIfMissing(estimationCollection, undefined, null);
        expect(expectedResult).toEqual(estimationCollection);
      });
    });

    describe('compareEstimation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstimation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEstimation(entity1, entity2);
        const compareResult2 = service.compareEstimation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEstimation(entity1, entity2);
        const compareResult2 = service.compareEstimation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEstimation(entity1, entity2);
        const compareResult2 = service.compareEstimation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
