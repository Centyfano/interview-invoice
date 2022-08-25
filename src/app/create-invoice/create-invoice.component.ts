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
  finalForm = false;

  sellerDetails = this.fb.nonNullable.group({
    name: ['Nancy Drew', Validators.required],
    address: ['Kentucky St.', Validators.required],
    phone: ['0324545329', Validators.required],
    email: ['drew@seller.com', Validators.required],
  });

  customerDetails = this.fb.nonNullable.group({
    name: ['Peter Smith', Validators.required],
    address: ['141 Woodland Av.', Validators.required],
    phone: ['0203445667', Validators.required],
    email: ['smith@customer.com', Validators.required],
  });

  invoiceDetails = this.fb.nonNullable.group({
    number: [0, Validators.required],
    date: ['8/25/2022', Validators.required],
    paymentDue: ['8/25/2022', Validators.required],
    tax: [1, Validators.required],
    discount: [14, Validators.required],
    items: this.fb.array([
      this.fb.nonNullable.group({
        itemName: ['Wireless Mouse', Validators.required],
        quantity: [5, Validators.required],
        pricePerUnit: [25, Validators.required],
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
    this.finalForm = false;
    const det: InvoiceType = {
      customer: this.customerDetails.getRawValue(),
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

    // console.log(this.fullDetails);
    this.finalForm = true;
  }

  ngOnInit(): void {}
}
