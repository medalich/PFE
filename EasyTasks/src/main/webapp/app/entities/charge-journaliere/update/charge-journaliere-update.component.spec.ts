import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChargeJournaliereFormService } from './charge-journaliere-form.service';
import { ChargeJournaliereService } from '../service/charge-journaliere.service';
import { IChargeJournaliere } from '../charge-journaliere.model';
import { IRessource } from 'app/entities/ressource/ressource.model';
import { RessourceService } from 'app/entities/ressource/service/ressource.service';

import { ChargeJournaliereUpdateComponent } from './charge-journaliere-update.component';

describe('ChargeJournaliere Management Update Component', () => {
  let comp: ChargeJournaliereUpdateComponent;
  let fixture: ComponentFixture<ChargeJournaliereUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chargeJournaliereFormService: ChargeJournaliereFormService;
  let chargeJournaliereService: ChargeJournaliereService;
  let ressourceService: RessourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChargeJournaliereUpdateComponent],
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
      .overrideTemplate(ChargeJournaliereUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChargeJournaliereUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chargeJournaliereFormService = TestBed.inject(ChargeJournaliereFormService);
    chargeJournaliereService = TestBed.inject(ChargeJournaliereService);
    ressourceService = TestBed.inject(RessourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ressource query and add missing value', () => {
      const chargeJournaliere: IChargeJournaliere = { id: 456 };
      const ressource: IRessource = { id: 32255 };
      chargeJournaliere.ressource = ressource;

      const ressourceCollection: IRessource[] = [{ id: 2406 }];
      jest.spyOn(ressourceService, 'query').mockReturnValue(of(new HttpResponse({ body: ressourceCollection })));
      const additionalRessources = [ressource];
      const expectedCollection: IRessource[] = [...additionalRessources, ...ressourceCollection];
      jest.spyOn(ressourceService, 'addRessourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chargeJournaliere });
      comp.ngOnInit();

      expect(ressourceService.query).toHaveBeenCalled();
      expect(ressourceService.addRessourceToCollectionIfMissing).toHaveBeenCalledWith(
        ressourceCollection,
        ...additionalRessources.map(expect.objectContaining)
      );
      expect(comp.ressourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chargeJournaliere: IChargeJournaliere = { id: 456 };
      const ressource: IRessource = { id: 38346 };
      chargeJournaliere.ressource = ressource;

      activatedRoute.data = of({ chargeJournaliere });
      comp.ngOnInit();

      expect(comp.ressourcesSharedCollection).toContain(ressource);
      expect(comp.chargeJournaliere).toEqual(chargeJournaliere);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChargeJournaliere>>();
      const chargeJournaliere = { id: 123 };
      jest.spyOn(chargeJournaliereFormService, 'getChargeJournaliere').mockReturnValue(chargeJournaliere);
      jest.spyOn(chargeJournaliereService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chargeJournaliere });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chargeJournaliere }));
      saveSubject.complete();

      // THEN
      expect(chargeJournaliereFormService.getChargeJournaliere).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chargeJournaliereService.update).toHaveBeenCalledWith(expect.objectContaining(chargeJournaliere));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChargeJournaliere>>();
      const chargeJournaliere = { id: 123 };
      jest.spyOn(chargeJournaliereFormService, 'getChargeJournaliere').mockReturnValue({ id: null });
      jest.spyOn(chargeJournaliereService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chargeJournaliere: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chargeJournaliere }));
      saveSubject.complete();

      // THEN
      expect(chargeJournaliereFormService.getChargeJournaliere).toHaveBeenCalled();
      expect(chargeJournaliereService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChargeJournaliere>>();
      const chargeJournaliere = { id: 123 };
      jest.spyOn(chargeJournaliereService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chargeJournaliere });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chargeJournaliereService.update).toHaveBeenCalled();
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
