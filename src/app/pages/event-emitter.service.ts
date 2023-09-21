import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeFirstComponentFunction = new EventEmitter();
  invokeSecondComponentFunction = new EventEmitter();
  subsVar: Subscription;
  subsVar1: Subscription;
  constructor() { }

  onFirstComponentButtonClick(name: string) {
    this.invokeFirstComponentFunction.emit(name);
  }
  onSecondComponentButtonClick(name: string) {
    this.invokeSecondComponentFunction.emit(name);
  }
}
