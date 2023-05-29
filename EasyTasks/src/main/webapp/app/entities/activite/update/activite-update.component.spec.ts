import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActiviteFormService } from './activite-form.service';
import { ActiviteService } from '../service/activite.service';
import { IActivite } from '../activite.model';
import { ILivrable } from 'app/entities/livrable/livrable.model';
import { LivrableService } from 'app/entities/livrable/service/livrable.service';

import { ActiviteUpdateComponent } from './activite-update.component';

describe('Activite Management Update Component', () => {
  let comp: ActiviteUpdateComponent;
  let fixture: ComponentFixture<ActiviteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activiteFormService: ActiviteFormService;
  let activiteService: ActiviteService;
  let livrableService: LivrableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActiviteUpdateComponent],
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
      .overrideTemplate(ActiviteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActiviteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activiteFormService = TestBed.inject(ActiviteFormService);
    activiteService = TestBed.inject(ActiviteService);
    livrableService = TestBed.inject(LivrableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Livrable query and add missing value', () => {
      const activite: IActivite = { id: 456 };
      const livrable: ILivrable = { id: 92491 };
      activite.livrable = livrable;

      const livrableCollection: ILivrable[] = [{ id: 60701 }];
      jest.spyOn(livrableService, 'query').mockReturnValue(of(new HttpResponse({ body: livrableCollection })));
      const additionalLivrables = [livrable];
      const expectedCollection: ILivrable[] = [...additionalLivrables, ...livrableCollection];
      jest.spyOn(livrableService, 'addLivrableToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activite });
      comp.ngOnInit();

      expect(livrableService.query).toHaveBeenCalled();
      expect(livrableService.addLivrableToCollectionIfMissing).toHaveBeenCalledWith(
        livrableCollection,
        ...additionalLivrables.map(expect.objectContaining)
      );
      expect(comp.livrablesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activite: IActivite = { id: 456 };
      const livrable: ILivrable = { id: 98732 };
      activite.livrable = livrable;

      activatedRoute.data = of({ activite });
      comp.ngOnInit();

      expect(comp.livrablesSharedCollection).toContain(livrable);
      expect(comp.activite).toEqual(activite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivite>>();
      const activite = { id: 123 };
      jest.spyOn(activiteFormService, 'getActivite').mockReturnValue(activite);
      jest.spyOn(activiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activite }));
      saveSubject.complete();

      // THEN
      expect(activiteFormService.getActivite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activiteService.update).toHaveBeenCalledWith(expect.objectContaining(activite));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivite>>();
      const activite = { id: 123 };
      jest.spyOn(activiteFormService, 'getActivite').mockReturnValue({ id: null });
      jest.spyOn(activiteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activite }));
      saveSubject.complete();

      // THEN
      expect(activiteFormService.getActivite).toHaveBeenCalled();
      expect(activiteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivite>>();
      const activite = { id: 123 };
      jest.spyOn(activiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activiteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLivrable', () => {
      it('Should forward to livrableService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(livrableService, 'compareLivrable');
        comp.compareLivrable(entity, entity2);
        expect(livrableService.compareLivrable).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
