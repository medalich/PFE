import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LivrableFormService } from './livrable-form.service';
import { LivrableService } from '../service/livrable.service';
import { ILivrable } from '../livrable.model';
import { IProjet } from 'app/entities/projet/projet.model';
import { ProjetService } from 'app/entities/projet/service/projet.service';
import { IFacture } from 'app/entities/facture/facture.model';
import { FactureService } from 'app/entities/facture/service/facture.service';

import { LivrableUpdateComponent } from './livrable-update.component';

describe('Livrable Management Update Component', () => {
  let comp: LivrableUpdateComponent;
  let fixture: ComponentFixture<LivrableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let livrableFormService: LivrableFormService;
  let livrableService: LivrableService;
  let projetService: ProjetService;
  let factureService: FactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LivrableUpdateComponent],
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
      .overrideTemplate(LivrableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivrableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    livrableFormService = TestBed.inject(LivrableFormService);
    livrableService = TestBed.inject(LivrableService);
    projetService = TestBed.inject(ProjetService);
    factureService = TestBed.inject(FactureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Projet query and add missing value', () => {
      const livrable: ILivrable = { id: 456 };
      const projet: IProjet = { id: 19951 };
      livrable.projet = projet;

      const projetCollection: IProjet[] = [{ id: 16498 }];
      jest.spyOn(projetService, 'query').mockReturnValue(of(new HttpResponse({ body: projetCollection })));
      const additionalProjets = [projet];
      const expectedCollection: IProjet[] = [...additionalProjets, ...projetCollection];
      jest.spyOn(projetService, 'addProjetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livrable });
      comp.ngOnInit();

      expect(projetService.query).toHaveBeenCalled();
      expect(projetService.addProjetToCollectionIfMissing).toHaveBeenCalledWith(
        projetCollection,
        ...additionalProjets.map(expect.objectContaining)
      );
      expect(comp.projetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Facture query and add missing value', () => {
      const livrable: ILivrable = { id: 456 };
      const facture: IFacture = { id: 33573 };
      livrable.facture = facture;

      const factureCollection: IFacture[] = [{ id: 65957 }];
      jest.spyOn(factureService, 'query').mockReturnValue(of(new HttpResponse({ body: factureCollection })));
      const additionalFactures = [facture];
      const expectedCollection: IFacture[] = [...additionalFactures, ...factureCollection];
      jest.spyOn(factureService, 'addFactureToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livrable });
      comp.ngOnInit();

      expect(factureService.query).toHaveBeenCalled();
      expect(factureService.addFactureToCollectionIfMissing).toHaveBeenCalledWith(
        factureCollection,
        ...additionalFactures.map(expect.objectContaining)
      );
      expect(comp.facturesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const livrable: ILivrable = { id: 456 };
      const projet: IProjet = { id: 8240 };
      livrable.projet = projet;
      const facture: IFacture = { id: 51541 };
      livrable.facture = facture;

      activatedRoute.data = of({ livrable });
      comp.ngOnInit();

      expect(comp.projetsSharedCollection).toContain(projet);
      expect(comp.facturesSharedCollection).toContain(facture);
      expect(comp.livrable).toEqual(livrable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivrable>>();
      const livrable = { id: 123 };
      jest.spyOn(livrableFormService, 'getLivrable').mockReturnValue(livrable);
      jest.spyOn(livrableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livrable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livrable }));
      saveSubject.complete();

      // THEN
      expect(livrableFormService.getLivrable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(livrableService.update).toHaveBeenCalledWith(expect.objectContaining(livrable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivrable>>();
      const livrable = { id: 123 };
      jest.spyOn(livrableFormService, 'getLivrable').mockReturnValue({ id: null });
      jest.spyOn(livrableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livrable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livrable }));
      saveSubject.complete();

      // THEN
      expect(livrableFormService.getLivrable).toHaveBeenCalled();
      expect(livrableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivrable>>();
      const livrable = { id: 123 };
      jest.spyOn(livrableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livrable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(livrableService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProjet', () => {
      it('Should forward to projetService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projetService, 'compareProjet');
        comp.compareProjet(entity, entity2);
        expect(projetService.compareProjet).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFacture', () => {
      it('Should forward to factureService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(factureService, 'compareFacture');
        comp.compareFacture(entity, entity2);
        expect(factureService.compareFacture).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
