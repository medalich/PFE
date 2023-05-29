import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILivrable } from '../livrable.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../livrable.test-samples';

import { LivrableService, RestLivrable } from './livrable.service';

const requireRestSample: RestLivrable = {
  ...sampleWithRequiredData,
  dateDebut: sampleWithRequiredData.dateDebut?.format(DATE_FORMAT),
  dateFin: sampleWithRequiredData.dateFin?.format(DATE_FORMAT),
};

describe('Livrable Service', () => {
  let service: LivrableService;
  let httpMock: HttpTestingController;
  let expectedResult: ILivrable | ILivrable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LivrableService);
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

    it('should create a Livrable', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const livrable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(livrable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Livrable', () => {
      const livrable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(livrable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Livrable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Livrable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Livrable', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLivrableToCollectionIfMissing', () => {
      it('should add a Livrable to an empty array', () => {
        const livrable: ILivrable = sampleWithRequiredData;
        expectedResult = service.addLivrableToCollectionIfMissing([], livrable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(livrable);
      });

      it('should not add a Livrable to an array that contains it', () => {
        const livrable: ILivrable = sampleWithRequiredData;
        const livrableCollection: ILivrable[] = [
          {
            ...livrable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLivrableToCollectionIfMissing(livrableCollection, livrable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Livrable to an array that doesn't contain it", () => {
        const livrable: ILivrable = sampleWithRequiredData;
        const livrableCollection: ILivrable[] = [sampleWithPartialData];
        expectedResult = service.addLivrableToCollectionIfMissing(livrableCollection, livrable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(livrable);
      });

      it('should add only unique Livrable to an array', () => {
        const livrableArray: ILivrable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const livrableCollection: ILivrable[] = [sampleWithRequiredData];
        expectedResult = service.addLivrableToCollectionIfMissing(livrableCollection, ...livrableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const livrable: ILivrable = sampleWithRequiredData;
        const livrable2: ILivrable = sampleWithPartialData;
        expectedResult = service.addLivrableToCollectionIfMissing([], livrable, livrable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(livrable);
        expect(expectedResult).toContain(livrable2);
      });

      it('should accept null and undefined values', () => {
        const livrable: ILivrable = sampleWithRequiredData;
        expectedResult = service.addLivrableToCollectionIfMissing([], null, livrable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(livrable);
      });

      it('should return initial array if no Livrable is added', () => {
        const livrableCollection: ILivrable[] = [sampleWithRequiredData];
        expectedResult = service.addLivrableToCollectionIfMissing(livrableCollection, undefined, null);
        expect(expectedResult).toEqual(livrableCollection);
      });
    });

    describe('compareLivrable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLivrable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLivrable(entity1, entity2);
        const compareResult2 = service.compareLivrable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLivrable(entity1, entity2);
        const compareResult2 = service.compareLivrable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLivrable(entity1, entity2);
        const compareResult2 = service.compareLivrable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
