import Joi from 'joi';
 
export const ListAcronymSchema = Joi.object({
  from: Joi.number()
    .optional()
    .default(0),

  limit: Joi.number()
    .optional()
    .default(10),

  search: Joi.string()
    .optional()
});

export interface ListAcronymRequest {
  from?: number
  limit?: number
  search?: string
}

  
