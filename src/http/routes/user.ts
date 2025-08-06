import { checkToken } from "@/middlewares/checkToken";
import { authenticateUser } from "../controllers/user/authenticateUser";
import { controlLimit } from "../controllers/user/controlLimit";
import { generalSummary } from "../controllers/user/generalSummary";
import { getAllMovements } from "../controllers/user/getAllMovements";
import { getUserByToken } from "../controllers/user/getUserByToken";
import { registerUser } from "../controllers/user/registerUser";
import { updateAvatar } from "../controllers/user/updateAvatar";
import { updatePassword } from "../controllers/user/updatePassword";
import { updateUser } from "../controllers/user/updateUser";
import { FastifyTypes } from "@/@types/fastifyTypes";
import z from "zod";



export async function userRoutes(app: FastifyTypes){

	app.post("/authenticate", {
		schema: {
			body: z.object({
				email: z.string(),
				password: z.string()
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for authenticating the user based on their access credentials.",
		} 
	}, authenticateUser);

	app.put("/controlLimit", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer ")
			}),
			body: z.object({
				limit: z.number(),
				dueDay: z.number(),
				closingDay: z.number()
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for updating data related to the limit that the user can spend, such as the limit, closing and expiration dates of their accounts."
		},
		preHandler: checkToken
	}, controlLimit);

	app.get("/generalSummary", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer "),
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for fetching all the main data related to the user such as values in applications, cards, transactions and personal data."
		},
		preHandler: checkToken,
	}, generalSummary);

	app.post("/getAllMovements", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer "),
			}),
			body: z.object({
				name: z.string().nullable(),
				cursor: z.string().nullable()
			}),
			response: {
				204: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for searching for all purchasing movements carried out"
		},
		preHandler: checkToken,
	}, getAllMovements);

	app.get("/getUserByToken", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer "),
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for searching for a user based on their token"
		},
		preHandler: checkToken
	}, getUserByToken);
	
	app.post("/userRegister", {
		schema: {
			body: z.object({
				name: z.string(),
				email: z.string(),
				password: z.string()
			}),
			response: {
				201: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This endpoint is responsible for registering a new user.",
		}
	}, registerUser);

	app.put("/updatePassword", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer "),
			}),
			body: z.object({
				password: z.string(),
				newPassword: z.string()
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for updating the user's password."
		},
		preHandler: checkToken
	}, updatePassword);

	app.put("/updateAvatar", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer "),
			}),
			body: z.object({
				avatar: z.string(),
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This route is responsible for updating the user's avatar."
		},
		preHandler: checkToken,
		handler: updateAvatar
	});

	app.put("/updateUser", {
		schema: {
			headers: z.object({
				authorization: z.string().startsWith("Bearer "),
			}),
			body: z.object({
				name: z.string(),
				email: z.string()
			}),
			response: {
				200: z.object({msg: z.string()}),
				400: z.object({msg: z.string()})
			},
			tags: ["user"],
			description: "This router is responsible for updating the user informations."
		},
		preHandler: checkToken,
		handler: updateUser
	});
}