import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstimationFormService } from './estimation-form.service';
import { EstimationService } from '../service/estimation.service';
import { IEstimation } from '../estimation.model';
import { IProjet } from 'app/entities/projet/projet.model';
import { ProjetService } from 'app/entities/projet/service/projet.service';
import { ILivrable } from 'app/entities/livrable/livrable.model';
import { LivrableService } from 'app/entities/livrable/service/livrable.service';
import { IActivite } from 'app/entities/activite/activite.model';
import { ActiviteService } from 'app/entities/activite/service/activite.service';

import { EstimationUpdateComponent } from './estimation-update.component';

describe('Estimation Management Update Component', () => {
  let comp: EstimationUpdateComponent;
  let fixture: ComponentFixture<EstimationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estimationFormService: EstimationFormService;
  let estimationService: EstimationService;
  let projetService: ProjetService;
  let livrableService: LivrableService;
  let activiteService: ActiviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstimationUpdateComponent],
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
      .overrideTemplate(EstimationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstimationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estimationFormService = TestBed.inject(EstimationFormService);
    estimationService = TestBed.inject(EstimationService);
    projetService = TestBed.inject(ProjetService);
    livrableService = TestBed.inject(LivrableService);
    activiteService = TestBed.inject(ActiviteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Projet query and add missing value', () => {
      const estimation: IEstimation = { id: 456 };
      const projet: IProjet = { id: 27778 };
      estimation.projet = projet;

      const projetCollection: IProjet[] = [{ id: 19969 }];
      jest.spyOn(projetService, 'query').mockReturnValue(of(new HttpResponse({ body: projetCollection })));
      const additionalProjets = [projet];
      const expectedCollection: IProjet[] = [...additionalProjets, ...projetCollection];
      jest.spyOn(projetService, 'addProjetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estimation });
      comp.ngOnInit();

      expect(projetService.query).toHaveBeenCalled();
      expect(projetService.addProjetToCollectionIfMissing).toHaveBeenCalledWith(
        projetCollection,
        ...additionalProjets.map(expect.objectContaining)
      );
      expect(comp.projetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Livrable query and add missing value', () => {
      const estimation: IEstimation = { id: 456 };
      const livrable: ILivrable = { id: 78486 };
      estimation.livrable = livrable;

      const livrableCollection: ILivrable[] = [{ id: 68903 }];
      jest.spyOn(livrableService, 'query').mockReturnValue(of(new HttpResponse({ body: livrableCollection })));
      const additionalLivrables = [livrable];
      const expectedCollection: ILivrable[] = [...additionalLivrables, ...livrableCollection];
      jest.spyOn(livrableService, 'addLivrableToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estimation });
      comp.ngOnInit();

      expect(livrableService.query).toHaveBeenCalled();
      expect(livrableService.addLivrableToCollectionIfMissing).toHaveBeenCalledWith(
        livrableCollection,
        ...additionalLivrables.map(expect.objectContaining)
      );
      expect(comp.livrablesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Activite query and add missing value', () => {
      const estimation: IEstimation = { id: 456 };
      const activite: IActivite = { id: 37802 };
      estimation.activite = activite;

      const activiteCollection: IActivite[] = [{ id: 75651 }];
      jest.spyOn(activiteService, 'query').mockReturnValue(of(new HttpResponse({ body: activiteCollection })));
      const additionalActivites = [activite];
      const expectedCollection: IActivite[] = [...additionalActivites, ...activiteCollection];
      jest.spyOn(activiteService, 'addActiviteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estimation });
      comp.ngOnInit();

      expect(activiteService.query).toHaveBeenCalled();
      expect(activiteService.addActiviteToCollectionIfMissing).toHaveBeenCalledWith(
        activiteCollection,
        ...additionalActivites.map(expect.objectContaining)
      );
      expect(comp.activitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estimation: IEstimation = { id: 456 };
      const projet: IProjet = { id: 56614 };
      estimation.projet = projet;
      const livrable: ILivrable = { id: 46173 };
      estimation.livrable = livrable;
      const activite: IActivite = { id: 355 };
      estimation.activite = activite;

      activatedRoute.data = of({ estimation });
      comp.ngOnInit();

      expect(comp.projetsSharedCollection).toContain(projet);
      expect(comp.livrablesSharedCollection).toContain(livrable);
      expect(comp.activitesSharedCollection).toContain(activite);
      expect(comp.estimation).toEqual(estimation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimation>>();
      const estimation = { id: 123 };
      jest.spyOn(estimationFormService, 'getEstimation').mockReturnValue(estimation);
      jest.spyOn(estimationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimation }));
      saveSubject.complete();

      // THEN
      expect(estimationFormService.getEstimation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estimationService.update).toHaveBeenCalledWith(expect.objectContaining(estimation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimation>>();
      const estimation = { id: 123 };
      jest.spyOn(estimationFormService, 'getEstimation').mockReturnValue({ id: null });
      jest.spyOn(estimationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimation }));
      saveSubject.complete();

      // THEN
      expect(estimationFormService.getEstimation).toHaveBeenCalled();
      expect(estimationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimation>>();
      const estimation = { id: 123 };
      jest.spyOn(estimationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estimationService.update).toHaveBeenCalled();
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

    describe('compareLivrable', () => {
      it('Should forward to livrableService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(livrableService, 'compareLivrable');
        comp.compareLivrable(entity, entity2);
        expect(livrableService.compareLivrable).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActivite', () => {
      it('Should forward to activiteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activiteService, 'compareActivite');
        comp.compareActivite(entity, entity2);
        expect(activiteService.compareActivite).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
