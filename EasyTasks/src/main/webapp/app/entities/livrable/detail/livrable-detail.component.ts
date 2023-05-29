import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILivrable } from '../livrable.model';

@Component({
  selector: 'jhi-livrable-detail',
  templateUrl: './livrable-detail.component.html',
})
export class LivrableDetailComponent implements OnInit {
  livrable: ILivrable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livrable }) => {
      this.livrable = livrable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
