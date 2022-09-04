import joi from "joi"

const dateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
const passwordRegex = /^[0-9]{4}$/

const cardActivationSchema = joi.object({
    cardNumber: joi.string().length(16).required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().pattern(dateRegex).required(),
    cvc: joi.string().length(3).required(),
    password: joi.string().length(4).required().pattern(passwordRegex)
})

export default cardActivationSchema;