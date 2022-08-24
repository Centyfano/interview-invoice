import { StepperOrientation } from '@angular/material/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';
import { InvoiceType } from './invoice-type';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
})
export class CreateInvoiceComponent implements OnInit {
  constructor(
    private title: Title,
    private fb: FormBuilder,
    bpObserver: BreakpointObserver
  ) {
    this.title.setTitle('Create Invoice');
    this.stepperOrientation = bpObserver
      .observe('(min-width: 880px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  stepperOrientation!: Observable<StepperOrientation>;
  fullDetails!: any; //InvoiceType ;

  sellerDetails = this.fb.group({
    name: [''],
    address: [''],
    phone: [''],
    email: [''],
  });

  buyerDetails = this.fb.group({
    name: [''],
    address: [''],
    phone: [''],
    email: [''],
  });

  invoiceDetails = this.fb.group({
    number: [''],
    date: [''],
    paymentDue: [''],
    tax: [],
    discount: [],
    items: this.fb.array([
      this.fb.group({
        itemName: [''],
        quantity: [''],
        pricePerUnit: [''],
      }),
    ]),
  });

  get items() {
    return this.invoiceDetails.get('items') as FormArray;
  }

  newItem() {
    return this.fb.group({
      itemName: [''],
      quantity: [''],
      pricePerUnit: [''],
    });
  }

  addItem() {
    this.items.push(this.newItem());
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  showForm() {
    this.fullDetails = {
      buyer: this.buyerDetails.value,
      seller: this.sellerDetails.value,
      invoice: this.invoiceDetails.value,
    };
    // this.fullDetails = { ...det };
    this.fullDetails.invoice.number = +Math.random().toFixed(6) * 10e6;
    console.log(this.fullDetails);
  }
  ngOnInit(): void {}
}
