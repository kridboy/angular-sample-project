import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['',Validators.required],
        lastName: ['',Validators.required],
        email: ['',[Validators.required,ValidationService.emailValidator]]
      }),
      shippingAddress: this.formBuilder.group({
        country: ['',Validators.required],
        state: ['',Validators.required],
        city: ['',Validators.required],
        postalCode: ['',Validators.required],
        streetName: ['',[Validators.required,Validators.pattern(/^[A-Za-z]+$/)]],
        streetNumber: ['',[Validators.required,ValidationService.onlyNumberValidator]]
      }),
      billingAddress: this.formBuilder.group({
        country: ['',Validators.required],
        state: ['',Validators.required],
        city: ['',Validators.required],
        postalCode: ['',Validators.required],
        streetName: ['',Validators.required],
        streetNumber: ['',[Validators.required,ValidationService.onlyNumberValidator]]
      }),
      creditCardInfo: this.formBuilder.group({
        cardType: ['',Validators.required],
        nameOnCard: ['',[Validators.required,Validators.pattern(/^[a-zA-Z ]*$/)]],
        cardNumber: ['',[Validators.required,ValidationService.creditCardValidator]],
        expirationDate:[''],
        securityCode:['',[Validators.required,Validators.maxLength(3),ValidationService.onlyNumberValidator]]
      })
    })

  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value)
  }

  adjustBillingInfo(checked: boolean) {
    let billingAddress = this.checkoutFormGroup.get('billingAddress')
    if (!checked) {
      billingAddress?.reset();
      billingAddress?.enable()
    } else {
      billingAddress?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value)
      billingAddress?.disable()
    }

  }
}
