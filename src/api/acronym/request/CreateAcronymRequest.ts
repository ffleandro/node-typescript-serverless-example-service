import Joi from 'joi';
 
export const CreateAcronymSchema: Joi.ObjectSchema = Joi.object({
  acronym: Joi.string()
    .required(),

  description: Joi.string()
    .required()
});

export interface CreateAcronymRequest {
  acronym: string
  description: string
}
