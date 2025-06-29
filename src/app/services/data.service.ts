import { Injectable } from '@angular/core';

export interface Message {
  taskId: string;
  date: string;
  id: number;
  read: boolean;
  warehouseName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public messages: Message[] = [
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: '9:32 AM',
      id: 0,
      read: false,
      warehouseName: "QWF-LK-84"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: '6:12 AM',
      id: 1,
      read: false,
      warehouseName: "RTY-PO-21"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: '4:55 AM',
      id: 2,
      read: false,
      warehouseName: "UIO-ZX-55"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: 'Yesterday',
      id: 3,
      read: false,
      warehouseName: "ASD-CV-98"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: 'Yesterday',
      id: 4,
      read: false,
      warehouseName: "FGH-BN-10"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: 'Yesterday',
      id: 5,
      read: false,
      warehouseName: "JKL-MN-67"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: 'Last Week',
      id: 6,
      read: false,
      warehouseName: "ZXC-VB-32"
    },
    {
      taskId: (Math.random() * 10000000000000).toFixed(),
      date: 'Last Week',
      id: 7,
      read: false,
      warehouseName: "VBN-NM-76"
    }
  ];

  constructor() { }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getMessageById(id: number): Message {
    return this.messages[id];
  }
}
