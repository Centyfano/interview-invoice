import { Component, Input, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Node } from 'pdfmake/interfaces';
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
    const name = this.invoice.customer.name.toLowerCase().split(' ');
    const pdfname = `${name[0]}${this.invoice.invoice.number}`;
    const phone = this.invoice.customer.phone;
    const password = `${name[name.length - 1]}-${phone.slice(-2)}`;
    let docDefinition: any = {
      userPassword: password,
      ownerPassword: `owner-${password}`,
      permissions: {
        printing: 'highResolution', //'lowResolution'
        modifying: false,
        copying: false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true,
      },
      info: {
        title: pdfname,
        author: this.invoice.seller.name,
        subject: 'Invoice',
        // keywords: 'keywords for document',
      },
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
              { text: this.invoice.customer.phone, margin: [0, 2, 0, 20] },
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
          table: {
            headerRows: 1,
            margin: [20, 20, 20, 20],
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                {
                  text: 'Item',
                  border: [false, true, false, true],
                  fillColor: '#fbe7d4',
                  bold: true,
                  margin: [0, 5, 0, 5],
                },

                {
                  text: 'Quantity',
                  border: [false, true, false, true],
                  fillColor: '#fbe7d4',
                  bold: true,
                  margin: [0, 5, 0, 5],
                },
                {
                  text: 'Price per unit',
                  border: [false, true, false, true],
                  fillColor: '#fbe7d4',
                  bold: true,
                  margin: [0, 5, 0, 5],
                },
                {
                  text: 'Amount',
                  border: [false, true, false, true],
                  fillColor: '#fbe7d4',
                  bold: true,
                  margin: [0, 5, 0, 5],
                },
              ],
              ...this.invoice.invoice.items.map((p: any) => [
                {
                  text: p.itemName,
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: p.quantity,
                  border: [false, true, false, true],
                  alignment: 'center',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '$' + p.pricePerUnit.toFixed(2),
                  border: [false, true, false, true],
                  alignment: 'center',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '$' + p.totalItem.toFixed(2),
                  border: [false, true, false, true],
                  alignment: 'center',
                  margin: [0, 5, 0, 5],
                },
              ]),
              [
                { text: '', colSpan: 2, border: [false, false, false, false] },
                { text: '', border: [false, false, false, false] },
                {
                  text: 'Subtotal',
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '$' + this.invoice.amount.toFixed(2),
                  alignment: 'center',
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                {
                  text: '',
                  colSpan: 2,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `Tax ${this.invoice.invoice.tax}%`,
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `$${(
                    (this.invoice.invoice.tax / 100) *
                    this.invoice.amount
                  ).toFixed(2)}`,
                  alignment: 'center',
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                { text: '', colSpan: 2, border: [false, false, false, false] },
                { text: '', border: [false, false, false, false] },
                {
                  text: `Fees/Discounts`,
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '$' + this.invoice.invoice.discount.toFixed(2),
                  alignment: 'center',
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                {
                  text: null,
                  colSpan: 2,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: null,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `TOTAL`,
                  alignment: 'center',
                  bold: true,
                  fillColor: '#fbe7d4',
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  text:
                    '$' +
                    (
                      this.invoice.amount + //subtotal
                      (this.invoice.invoice.tax / 100) * this.invoice.amount - //tax
                      this.invoice.invoice.discount
                    ).toFixed(2), // discount
                  fillColor: '#fbe7d4',
                  bold: true,
                  border: [false, false, false, false],
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },

        {
          margin: [0, 30, 0, 10],
          text: 'Terms and Conditions',
          color: 'gray',
          fontSize: 16,
        },
        {
          text: 'Terms and conditions go here',
          italics: true,
          fontSize: 11,
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
      pdfMake.createPdf(docDefinition).download(pdfname + '.pdf');
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

  ngOnInit(): void {}
}

class Invoice {
  name: string | undefined;
}
