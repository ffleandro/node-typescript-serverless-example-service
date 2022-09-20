import Joi from 'joi';
 
export const UpdateAcronymSchema: Joi.ObjectSchema = Joi.object({
  description: Joi.string()
});

export interface UpdateAcronymRequest {
  description?: string
}
