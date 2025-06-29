import { Injectable } from '@angular/core';

export interface Message {
  taskId: number;
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
      taskId: 4422342,
      date: '9:32 AM',
      id: 0,
      read: false,
      warehouseName: "Metallica"
    },
    {
      taskId: 847874874,
      date: '6:12 AM',
      id: 1,
      read: false,
      warehouseName: "Port"
    },
    {
      taskId: 62324234,
      date: '4:55 AM',
      id: 2,
      read: false,
      warehouseName: "Metallica"
    },
    {
      taskId: 3256245,
      date: 'Yesterday',
      id: 3,
      read: false,
      warehouseName: "Metallica"
    },
    {
      taskId: 234667234,
      date: 'Yesterday',
      id: 4,
      read: false,
      warehouseName: "Metallica"
    },
    {
      taskId: 62345345,
      date: 'Yesterday',
      id: 5,
      read: false,
      warehouseName: "Metallica"
    },
    {
      taskId: 62345345,
      date: 'Last Week',
      id: 6,
      read: false,
      warehouseName: "Metallica"
    },
    {
      taskId: 6234534,
      date: 'Last Week',
      id: 7,
      read: false,
      warehouseName: "Metallica"
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
