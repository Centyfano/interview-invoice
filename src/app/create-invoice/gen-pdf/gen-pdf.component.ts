import { Component, Input, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-gen-pdf',
  templateUrl: './gen-pdf.component.html',
  styleUrls: ['./gen-pdf.component.scss'],
})
export class GenPdfComponent implements OnInit {
  @Input() invoice: any;

  constructor() {}
  options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  generatePDF(action = 'open') {
    let docDefinition: any = {
      content: [
        {
          text: 'INVOICE',
          fontSize: 30,
          bold: true,
          alignment: 'left',
          margin: [0, 15],
        },
        { text: this.invoice.seller.name, margin: [0, 3] },
        { text: this.invoice.seller.address, margin: [0, 3] },
        { text: this.invoice.seller.email, margin: [0, 3] },
        { text: this.invoice.seller.phone, margin: [0, 3] },

        {
          columns: [
            [
              { text: 'Bill to', bold: true, fontSize: 18, margin: [0, 10] },
              { text: this.invoice.customer.name, margin: [0, 2] },
              { text: this.invoice.customer.address, margin: [0, 2] },
              { text: this.invoice.customer.email, margin: [0, 2] },
              { text: this.invoice.customer.phone, margin: [0, 2] },
            ],
            [
              {
                text: 'Invoice Details',
                bold: true,
                fontSize: 18,
                margin: [0, 10],
              },
              {
                columns: [
                  { text: 'Invoice Number:', bold: true },
                  {
                    text: this.invoice.invoice.number.toFixed(0),
                    margin: [0, 2],
                  },
                ],
              },
              {
                columns: [
                  { text: 'Invoice Date:', bold: true },
                  {
                    text: this.invoice.invoice.date.toLocaleDateString(
                      undefined,
                      this.options
                    ),
                    margin: [0, 2],
                  },
                ],
              },
              {
                columns: [
                  { text: 'Payment Due:', bold: true },
                  {
                    text: this.invoice.invoice.paymentDue.toLocaleDateString(
                      undefined,
                      this.options
                    ),
                    margin: [0, 2],
                  },
                ],
              },
            ],
          ],
        },
        {
          text: 'Order Details',
          style: 'sectionHeader',
          margin: [0, 10],
        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            margin: [0, 10],
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Item', 'Price per unit', 'Quantity', 'Amount'],
              ...this.invoice.invoice.items.map((p: any) => [
                p.itemName,
                '$' + p.pricePerUnit.toFixed(2),
                p.quantity,
                '$' + p.totalItem.toFixed(2),
              ]),
            ],
          },
        },
        {
          layout: 'noBorders',
          table: {
            // headerRows: 1,
            margin: [0, 10],
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              // ['Product', 'Price per unit', 'Quantity', 'Amount'],

              [
                { text: null, colSpan: 2 },
                {},
                { text: 'Subtotal', alignment: 'center', bold: true },
                { text: '$' + this.invoice.amount.toFixed(2) },
              ],
              [
                { text: null, colSpan: 2 },
                {},
                {
                  text: `Tax ${this.invoice.invoice.tax}%`,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: `$${(
                    (this.invoice.invoice.tax / 100) *
                    this.invoice.amount
                  ).toFixed(2)}`,
                },
              ],
              [
                { text: null, colSpan: 2 },
                {},
                {
                  text: `Fees/Discounts`,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '$' + this.invoice.invoice.discount.toFixed(2),
                },
              ],
            ],
          },
        },
        {
          layout: {
            hLineStyle: (i: any, node: any) => {
              return { dash: { length: 10, space: 0 } };
              // return { dash: { length: 4 } };
            },
            vLineStyle: (
              i: number,
              node: { table: { widths: string | any[] } }
            ) => {
              return { dash: null };
            },
          },
          table: {
            // headerRows: 1,
            margin: [0, 10],
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: null, colSpan: 2 },
                {},
                {
                  text: `TOTAL`,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text:
                    '$' +
                    (
                      this.invoice.amount + //subtotal
                      (this.invoice.invoice.tax / 100) * this.invoice.amount - //tax
                      this.invoice.invoice.discount
                    ).toFixed(2), // discount
                },
              ],
            ],
          },
        },
        {
          margin: [0, 30, 0, 10],
          text: 'Terms and Conditions',
          style: 'sectionHeader',
        },
        {
          text: 'Terms and conditions go here',
          italics: true,
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake
        .createPdf(
          docDefinition,
          pdfMake.tableLayouts,
          pdfMake.fonts,
          pdfMake.vfs
        )
        .open();
    }
  }

  ngOnInit(): void {
    console.log(this.invoice);
  }
}

class Invoice {
  name: string | undefined;
}
