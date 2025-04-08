import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, it, jest, beforeEach, afterEach } from "@jest/globals";


describe("utils/handler due dates", () => {

	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-03-05T12:00:00Z"));
	});

	afterEach(() => {
		jest.useRealTimers();
	});


	it("Dates are created correctly", async () => {

		const dueDay = 10;
		const closeDay = 2;
		const amount = 10;


		const dueDates = new HandlerDueDate().generateDueDates(dueDay, closeDay, amount);
		console.log(dueDates);
	});
});