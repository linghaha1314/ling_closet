import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WardrobePage } from './wardrobe.page';

const routes: Routes = [
  {
    path: '',
    component: WardrobePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WardrobePageRoutingModule {}
