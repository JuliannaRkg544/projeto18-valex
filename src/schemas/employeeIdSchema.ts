import joi from "joi"


const employeeIdSchema = joi.object({
    employeeid: joi.number().required()
})

export default employeeIdSchema;