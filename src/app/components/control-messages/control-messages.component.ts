import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";

@Component({
  selector: 'app-control-messages',
  template:`
    <div *ngIf="errorMessage !== null">bad booboo</div>
  `
})
export class ControlMessagesComponent {
  @Input() control: any;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control?.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }
    return null;
  }
}
