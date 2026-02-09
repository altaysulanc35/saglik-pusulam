import { z } from 'zod';
import { analyzeSymptomSchema, analysisResponseSchema, searchHospitalsSchema, hospitalsListSchema } from './schema';

export const api = {
  symptoms: {
    analyze: {
      method: 'POST' as const,
      path: '/api/symptoms/analyze' as const,
      input: analyzeSymptomSchema,
      responses: {
        200: analysisResponseSchema,
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  },
  hospitals: {
    list: {
      method: 'GET' as const,
      path: '/api/hospitals' as const,
      input: searchHospitalsSchema,
      responses: {
        200: hospitalsListSchema,
        400: z.object({ message: z.string() }),
      },
    },
  },
};
