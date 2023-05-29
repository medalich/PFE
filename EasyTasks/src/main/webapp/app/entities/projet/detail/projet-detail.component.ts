import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProjet } from '../projet.model';

@Component({
  selector: 'jhi-projet-detail',
  templateUrl: './projet-detail.component.html',
})
export class ProjetDetailComponent implements OnInit {
  projet: IProjet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projet }) => {
      this.projet = projet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
