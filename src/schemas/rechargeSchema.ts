import joi from "joi"

const rechargeSchema = joi.object({
    cardNumber: joi.string().length(16).required(),
    rechargeValue: joi.number().min(1).required()
})

export default rechargeSchema