import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../estimation.test-samples';

import { EstimationFormService } from './estimation-form.service';

describe('Estimation Form Service', () => {
  let service: EstimationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimationFormService);
  });

  describe('Service methods', () => {
    describe('createEstimationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstimationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            valeurJour: expect.any(Object),
            valeurHeure: expect.any(Object),
            priseEnCharge: expect.any(Object),
            type: expect.any(Object),
            projet: expect.any(Object),
            livrable: expect.any(Object),
            activite: expect.any(Object),
          })
        );
      });

      it('passing IEstimation should create a new form with FormGroup', () => {
        const formGroup = service.createEstimationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            valeurJour: expect.any(Object),
            valeurHeure: expect.any(Object),
            priseEnCharge: expect.any(Object),
            type: expect.any(Object),
            projet: expect.any(Object),
            livrable: expect.any(Object),
            activite: expect.any(Object),
          })
        );
      });
    });

    describe('getEstimation', () => {
      it('should return NewEstimation for default Estimation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEstimationFormGroup(sampleWithNewData);

        const estimation = service.getEstimation(formGroup) as any;

        expect(estimation).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstimation for empty Estimation initial value', () => {
        const formGroup = service.createEstimationFormGroup();

        const estimation = service.getEstimation(formGroup) as any;

        expect(estimation).toMatchObject({});
      });

      it('should return IEstimation', () => {
        const formGroup = service.createEstimationFormGroup(sampleWithRequiredData);

        const estimation = service.getEstimation(formGroup) as any;

        expect(estimation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstimation should not enable id FormControl', () => {
        const formGroup = service.createEstimationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstimation should disable id FormControl', () => {
        const formGroup = service.createEstimationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
