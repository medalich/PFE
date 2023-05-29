import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChargeJournaliere } from '../charge-journaliere.model';

@Component({
  selector: 'jhi-charge-journaliere-detail',
  templateUrl: './charge-journaliere-detail.component.html',
})
export class ChargeJournaliereDetailComponent implements OnInit {
  chargeJournaliere: IChargeJournaliere | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chargeJournaliere }) => {
      this.chargeJournaliere = chargeJournaliere;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
