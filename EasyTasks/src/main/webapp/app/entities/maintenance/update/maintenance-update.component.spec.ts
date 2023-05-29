import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MaintenanceFormService } from './maintenance-form.service';
import { MaintenanceService } from '../service/maintenance.service';
import { IMaintenance } from '../maintenance.model';
import { IRessource } from 'app/entities/ressource/ressource.model';
import { RessourceService } from 'app/entities/ressource/service/ressource.service';

import { MaintenanceUpdateComponent } from './maintenance-update.component';

describe('Maintenance Management Update Component', () => {
  let comp: MaintenanceUpdateComponent;
  let fixture: ComponentFixture<MaintenanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let maintenanceFormService: MaintenanceFormService;
  let maintenanceService: MaintenanceService;
  let ressourceService: RessourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MaintenanceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MaintenanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MaintenanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    maintenanceFormService = TestBed.inject(MaintenanceFormService);
    maintenanceService = TestBed.inject(MaintenanceService);
    ressourceService = TestBed.inject(RessourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ressource query and add missing value', () => {
      const maintenance: IMaintenance = { id: 456 };
      const ressource: IRessource = { id: 28475 };
      maintenance.ressource = ressource;

      const ressourceCollection: IRessource[] = [{ id: 16056 }];
      jest.spyOn(ressourceService, 'query').mockReturnValue(of(new HttpResponse({ body: ressourceCollection })));
      const additionalRessources = [ressource];
      const expectedCollection: IRessource[] = [...additionalRessources, ...ressourceCollection];
      jest.spyOn(ressourceService, 'addRessourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ maintenance });
      comp.ngOnInit();

      expect(ressourceService.query).toHaveBeenCalled();
      expect(ressourceService.addRessourceToCollectionIfMissing).toHaveBeenCalledWith(
        ressourceCollection,
        ...additionalRessources.map(expect.objectContaining)
      );
      expect(comp.ressourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const maintenance: IMaintenance = { id: 456 };
      const ressource: IRessource = { id: 41279 };
      maintenance.ressource = ressource;

      activatedRoute.data = of({ maintenance });
      comp.ngOnInit();

      expect(comp.ressourcesSharedCollection).toContain(ressource);
      expect(comp.maintenance).toEqual(maintenance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaintenance>>();
      const maintenance = { id: 123 };
      jest.spyOn(maintenanceFormService, 'getMaintenance').mockReturnValue(maintenance);
      jest.spyOn(maintenanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maintenance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: maintenance }));
      saveSubject.complete();

      // THEN
      expect(maintenanceFormService.getMaintenance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(maintenanceService.update).toHaveBeenCalledWith(expect.objectContaining(maintenance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaintenance>>();
      const maintenance = { id: 123 };
      jest.spyOn(maintenanceFormService, 'getMaintenance').mockReturnValue({ id: null });
      jest.spyOn(maintenanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maintenance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: maintenance }));
      saveSubject.complete();

      // THEN
      expect(maintenanceFormService.getMaintenance).toHaveBeenCalled();
      expect(maintenanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaintenance>>();
      const maintenance = { id: 123 };
      jest.spyOn(maintenanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maintenance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(maintenanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRessource', () => {
      it('Should forward to ressourceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ressourceService, 'compareRessource');
        comp.compareRessource(entity, entity2);
        expect(ressourceService.compareRessource).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
