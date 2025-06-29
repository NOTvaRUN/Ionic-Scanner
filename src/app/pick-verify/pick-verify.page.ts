
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, Platform, RefresherCustomEvent } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-pick-verify',
  templateUrl: './pick-verify.page.html',
  styleUrls: ['./pick-verify.page.scss'],
  standalone: false,
})
export class PickVerifyPage implements OnInit {
  public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);

  constructor() {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
  
  ngOnInit() {
    // const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    // this.message = this.data.getMessageById(parseInt(id, 10));
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Home' : '';
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }
}
