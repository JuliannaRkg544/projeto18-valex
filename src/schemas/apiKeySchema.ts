import joi from "joi";

const apiKeySchema = joi.object({
    apiKey: joi.string().required()
})

export default apiKeySchema