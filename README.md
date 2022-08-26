# Invoice Generator

This project uses Angular v14.1.3 and Node v16.17.0

## Usage

- Install dependencies by running `npm i`
- Start the dev server by the command `ng s`, and navigate to `http://localhost:4200` on your browser

## Generating PDF

Fill in the details in the forms based on the page heading:

- Seller (Sending the invoice)
- Buyer
- Invoice details

All fields in all forms are required

> The invoice number is automatically generated as a 6-digit number, hence not included in the form

## Opening the PDF

The PDF generated invoices are password-protected. To open, the user password is `lastName-last2Phonedigits`, i.e,

If buyer's name is Andrew Jones and phone number 536-421-7286,

- user password is `jones-86`
- owner's password is `owner-jones-86`
