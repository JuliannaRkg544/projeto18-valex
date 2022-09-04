import joi from "joi"

const passwordRegex = /^[0-9]{4}$/

const blockUnblockSchema = joi.object({
    cardNumber: joi.string().length(16).required(),
    password: joi.string().pattern(passwordRegex).required()
})

export default blockUnblockSchema
