import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  async sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }
}
