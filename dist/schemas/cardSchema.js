import joi from "joi";
export var createCardSchema = joi.object({
    employeeId: joi
        .number()
        .required(),
    cardtype: joi
        .string()
        .valid('groceries', 'restaurants', 'transport', 'education', 'health')
        .required()
});
