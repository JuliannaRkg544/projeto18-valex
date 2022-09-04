import joi from "joi";

const cardTypeSchema = joi.object({
  cardtype: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export default cardTypeSchema;
