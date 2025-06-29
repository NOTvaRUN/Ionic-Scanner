import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickVerifyPage } from './pick-verify.page';

import { IonicModule } from '@ionic/angular';
import { PickVerifyPageRoutingModule } from './pick-verify-routing.module';
import { MessageComponentModule } from '../message/message.module';
import { ViewMessagePageModule } from '../view-message/view-message.module';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickVerifyPageRoutingModule,
    MessageComponentModule,
    MatTableModule
  ],
  declarations: [PickVerifyPage]
})
export class PickVerifyPageModule {}
