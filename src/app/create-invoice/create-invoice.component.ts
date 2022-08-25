import { StepperOrientation } from '@angular/material/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';
import { InvoiceType } from './invoice-type';
import { MatTable } from '@angular/material/table';

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
  @ViewChild(MatTable) table!: MatTable<any>;

  stepperOrientation!: Observable<StepperOrientation>;
  fullDetails: InvoiceType | any;
  invoiceColumns = ['item', 'quantity', 'pricePerUnit', 'amount'];

  sellerDetails = this.fb.nonNullable.group({
    name: ['seller name', Validators.required],
    address: ['seller addr', Validators.required],
    phone: ['seller phone', Validators.required],
    email: ['seller email', Validators.required],
  });

  buyerDetails = this.fb.nonNullable.group({
    name: ['buyer', Validators.required],
    address: ['buyer addr', Validators.required],
    phone: ['buyer phone', Validators.required],
    email: ['buyer email', Validators.required],
  });

  invoiceDetails = this.fb.nonNullable.group({
    number: [0, Validators.required],
    date: ['8/25/2022', Validators.required],
    paymentDue: ['8/25/2022', Validators.required],
    tax: [12, Validators.required],
    discount: [14, Validators.required],
    items: this.fb.array([
      this.fb.nonNullable.group({
        itemName: ['Nme', Validators.required],
        quantity: [10, Validators.required],
        pricePerUnit: [20, Validators.required],
        totalItem: [0, Validators.required],
      }),
    ]),
  });

  get items() {
    return this.invoiceDetails.get('items') as FormArray;
  }

  newItem() {
    return this.fb.nonNullable.group({
      itemName: ['', Validators.required],
      quantity: ['', Validators.required],
      pricePerUnit: ['', Validators.required],
    });
  }

  addItem() {
    this.items.push(this.newItem());
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  getAmount(arr: any) {
    let amount = 0;
    arr.forEach((a: any) => {
      amount += a.totalItem;
    });
    return amount;
  }

  showForm() {
    const det: InvoiceType = {
      buyer: this.buyerDetails.getRawValue(),
      seller: this.sellerDetails.getRawValue(),
      invoice: this.invoiceDetails.getRawValue(),
      amount: 0,
    };

    det.invoice.items = det.invoice.items?.map((item) => {
      return { ...item, totalItem: item.quantity! * item.pricePerUnit! };
    });

    det.amount = this.getAmount(det.invoice.items);

    this.fullDetails = { ...det };
    this.fullDetails.invoice!.number = +Math.random().toFixed(6) * 10e6;
    this.fullDetails.amount = this.getAmount(det.invoice.items);

    console.log(this.fullDetails);
  }

  ngOnInit(): void {}
}
