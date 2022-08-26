import { StepperOrientation } from '@angular/material/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
  invDetailsChild: InvoiceType | any;
  invoiceColumns = ['item', 'quantity', 'pricePerUnit', 'amount'];
  // finalForm = false;
  finalForm = new BehaviorSubject(false);

  sellerDetails = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
  });

  customerDetails = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
  });

  invoiceDetails = this.fb.nonNullable.group({
    number: [0, Validators.required],
    date: ['', Validators.required],
    paymentDue: ['', Validators.required],
    tax: [0, [Validators.required, Validators.min(1)]],
    discount: [0, [Validators.required, Validators.min(1)]],
    items: this.fb.array([
      this.fb.nonNullable.group({
        itemName: ['', Validators.required],
        quantity: [0, [Validators.required, Validators.min(1)]],
        pricePerUnit: [0, [Validators.required, Validators.min(1)]],
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
      quantity: [0, [Validators.required, Validators.min(1)]],
      pricePerUnit: [0, [Validators.required, Validators.min(1)]],
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
    this.finalForm.next(false);
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
    this.invDetailsChild = this.fullDetails;
    console.log(this.fullDetails);

    this.finalForm.next(true);
  }
  clearInvoice() {
    this.finalForm.next(false);
    this.invDetailsChild = null;
  }
  checkStep(e: any) {
    if (e.selectedIndex == 2) this.clearInvoice();
  }

  ngOnInit(): void {}
}
