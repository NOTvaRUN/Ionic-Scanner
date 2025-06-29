import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickVerifyPage } from './pick-verify.page';

const routes: Routes = [
  {
    path: '',
    component: PickVerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickVerifyPageRoutingModule {}
