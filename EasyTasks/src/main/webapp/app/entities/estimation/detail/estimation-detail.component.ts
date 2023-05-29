import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstimation } from '../estimation.model';

@Component({
  selector: 'jhi-estimation-detail',
  templateUrl: './estimation-detail.component.html',
})
export class EstimationDetailComponent implements OnInit {
  estimation: IEstimation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estimation }) => {
      this.estimation = estimation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
