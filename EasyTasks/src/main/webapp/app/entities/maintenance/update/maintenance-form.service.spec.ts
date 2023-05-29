import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../maintenance.test-samples';

import { MaintenanceFormService } from './maintenance-form.service';

describe('Maintenance Form Service', () => {
  let service: MaintenanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceFormService);
  });

  describe('Service methods', () => {
    describe('createMaintenanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMaintenanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            produit: expect.any(Object),
            solution: expect.any(Object),
            etat: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            duree: expect.any(Object),
            ressource: expect.any(Object),
          })
        );
      });

      it('passing IMaintenance should create a new form with FormGroup', () => {
        const formGroup = service.createMaintenanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            produit: expect.any(Object),
            solution: expect.any(Object),
            etat: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            duree: expect.any(Object),
            ressource: expect.any(Object),
          })
        );
      });
    });

    describe('getMaintenance', () => {
      it('should return NewMaintenance for default Maintenance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMaintenanceFormGroup(sampleWithNewData);

        const maintenance = service.getMaintenance(formGroup) as any;

        expect(maintenance).toMatchObject(sampleWithNewData);
      });

      it('should return NewMaintenance for empty Maintenance initial value', () => {
        const formGroup = service.createMaintenanceFormGroup();

        const maintenance = service.getMaintenance(formGroup) as any;

        expect(maintenance).toMatchObject({});
      });

      it('should return IMaintenance', () => {
        const formGroup = service.createMaintenanceFormGroup(sampleWithRequiredData);

        const maintenance = service.getMaintenance(formGroup) as any;

        expect(maintenance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMaintenance should not enable id FormControl', () => {
        const formGroup = service.createMaintenanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMaintenance should disable id FormControl', () => {
        const formGroup = service.createMaintenanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
