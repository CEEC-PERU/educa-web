import { z } from "zod";

export const userCreationSchema = z.object({
  document_type: z.enum(["DNI", "CE", "PA"]),
  dni: z.string().trim().min(1, "El numero de documento es obligatorio."),
  first_name: z.string().trim().min(1, "El nombre es obligatorio."),
  last_name: z.string().trim().min(1, "El apellido es obligatorio."),
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().email("Ingresa un correo valido.").optional(),
  ),
}).superRefine(({ document_type, dni }, context) => {
  if (document_type === "DNI" && !/^\d{8}$/.test(dni)) {
    context.addIssue({ path: ["dni"], code: z.ZodIssueCode.custom, message: "El DNI debe tener exactamente 8 digitos." });
  }
  if (document_type === "CE" && !/^[a-zA-Z0-9]{8,12}$/.test(dni)) {
    context.addIssue({ path: ["dni"], code: z.ZodIssueCode.custom, message: "El CE debe tener entre 8 y 12 caracteres alfanumericos." });
  }
  if (document_type === "PA" && !/^[a-zA-Z0-9]{1,12}$/.test(dni)) {
    context.addIssue({ path: ["dni"], code: z.ZodIssueCode.custom, message: "El pasaporte debe tener hasta 12 caracteres alfanumericos." });
  }
});

export type UserCreationInput = z.infer<typeof userCreationSchema>;
