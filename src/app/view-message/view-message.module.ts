import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewMessagePage } from './view-message.page';
import { IonicModule } from '@ionic/angular';
import { ViewMessagePageRoutingModule } from './view-message-routing.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMessagePageRoutingModule,
    MatTableModule,
  ],
  declarations: [ViewMessagePage]
})
export class ViewMessagePageModule {}
