import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charge-journaliere.test-samples';

import { ChargeJournaliereFormService } from './charge-journaliere-form.service';

describe('ChargeJournaliere Form Service', () => {
  let service: ChargeJournaliereFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargeJournaliereFormService);
  });

  describe('Service methods', () => {
    describe('createChargeJournaliereFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChargeJournaliereFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            type: expect.any(Object),
            duree: expect.any(Object),
            ressource: expect.any(Object),
          })
        );
      });

      it('passing IChargeJournaliere should create a new form with FormGroup', () => {
        const formGroup = service.createChargeJournaliereFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            type: expect.any(Object),
            duree: expect.any(Object),
            ressource: expect.any(Object),
          })
        );
      });
    });

    describe('getChargeJournaliere', () => {
      it('should return NewChargeJournaliere for default ChargeJournaliere initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChargeJournaliereFormGroup(sampleWithNewData);

        const chargeJournaliere = service.getChargeJournaliere(formGroup) as any;

        expect(chargeJournaliere).toMatchObject(sampleWithNewData);
      });

      it('should return NewChargeJournaliere for empty ChargeJournaliere initial value', () => {
        const formGroup = service.createChargeJournaliereFormGroup();

        const chargeJournaliere = service.getChargeJournaliere(formGroup) as any;

        expect(chargeJournaliere).toMatchObject({});
      });

      it('should return IChargeJournaliere', () => {
        const formGroup = service.createChargeJournaliereFormGroup(sampleWithRequiredData);

        const chargeJournaliere = service.getChargeJournaliere(formGroup) as any;

        expect(chargeJournaliere).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChargeJournaliere should not enable id FormControl', () => {
        const formGroup = service.createChargeJournaliereFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChargeJournaliere should disable id FormControl', () => {
        const formGroup = service.createChargeJournaliereFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
