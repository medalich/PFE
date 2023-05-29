import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../livrable.test-samples';

import { LivrableFormService } from './livrable-form.service';

describe('Livrable Form Service', () => {
  let service: LivrableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivrableFormService);
  });

  describe('Service methods', () => {
    describe('createLivrableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLivrableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            refLivrable: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            description: expect.any(Object),
            etat: expect.any(Object),
            projet: expect.any(Object),
            facture: expect.any(Object),
          })
        );
      });

      it('passing ILivrable should create a new form with FormGroup', () => {
        const formGroup = service.createLivrableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            refLivrable: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            description: expect.any(Object),
            etat: expect.any(Object),
            projet: expect.any(Object),
            facture: expect.any(Object),
          })
        );
      });
    });

    describe('getLivrable', () => {
      it('should return NewLivrable for default Livrable initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLivrableFormGroup(sampleWithNewData);

        const livrable = service.getLivrable(formGroup) as any;

        expect(livrable).toMatchObject(sampleWithNewData);
      });

      it('should return NewLivrable for empty Livrable initial value', () => {
        const formGroup = service.createLivrableFormGroup();

        const livrable = service.getLivrable(formGroup) as any;

        expect(livrable).toMatchObject({});
      });

      it('should return ILivrable', () => {
        const formGroup = service.createLivrableFormGroup(sampleWithRequiredData);

        const livrable = service.getLivrable(formGroup) as any;

        expect(livrable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILivrable should not enable id FormControl', () => {
        const formGroup = service.createLivrableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLivrable should disable id FormControl', () => {
        const formGroup = service.createLivrableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
