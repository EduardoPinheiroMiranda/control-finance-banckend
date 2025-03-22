import { expect, it } from "@jest/globals";


function sum(a: number, b: number){
	return a + b;
}


it("Some dois valores", () => {

	expect(sum(2, 3)).toBe(5);
});