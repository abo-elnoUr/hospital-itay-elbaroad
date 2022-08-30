import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-treatment-registeration',
  templateUrl: './treatment-registeration.component.html',
  styleUrls: ['./treatment-registeration.component.scss'],
})
export class TreatmentRegisterationComponent implements OnInit {
  subscription = new Subscription();
  dateFrom = new Date();
  registerations: any[] = [];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  findAllTreatmentRegisterationByDateFromTo() {
    if (this.dateFrom) {
      this.registerations = [] ;
      const formData = new FormData();
      formData.append('dateFrom', JSON.stringify(this.dateFrom));
      this.subscription.add(
        this.dashboardService
          .findAllTreatmentRegisterationByDate(formData)
          .subscribe((res) => {
            if (res) {
              this.registerations = res ;
            }
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
