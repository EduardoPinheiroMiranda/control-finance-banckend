import { describe, it, expect, jest, beforeEach } from "@jest/global";


describe("service/invoice", () => {
  
  describe("service/invoice", () => {

    let invoiceRepositpry: InvoicePrismaRepository;
    let cardRepository: CardPrismaRepository;
    let serviceGetAllCardInvoices: GetAllCardInvoices;


    beforeEach(() => {
      invoiceRepository = new InvoicePrismaRepository();
      cardRepository = new CardPrismaRepository();
      serviceGetAllInvoices = new GetAllCardInvoices(
        invoiceRepository,
        cardRepository
      );
    });

    it("", async () => {
      
    });
  });
});
