import joi from "joi"

const purchaseSchema = joi.object({
    cardNumber: joi.string().length(16).required(),
    password: joi.string().length(4).required(),
    businessId: joi.number().required(),
    purchaseValue: joi.number().min(1).required()

})

export default purchaseSchema