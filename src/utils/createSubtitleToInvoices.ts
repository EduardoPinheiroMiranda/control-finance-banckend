import { CardInvoice } from "@/@types/prismaTypes";


export function createSubtitleToInvoices(invoices: {
    invoice_id: string,
    pay: boolean,
    due_date: Date,
    current: boolean,
}[]){

    const month = ["JAN","FEV","MAR","ABR","MAIO","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

    const subtitle = invoices.map((invoice) => {

        const getMonth = invoice.due_date.getMonth();
        const getYear = invoice.due_date.getFullYear();

        return {
            invoice_id: invoice.invoice_id,
            current: invoice.current,
            pay: invoice.pay,
            label: `${month[getMonth]}/${getYear}`
        }
    })


    return subtitle;
}