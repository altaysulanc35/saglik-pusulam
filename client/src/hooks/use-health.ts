import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type AnalyzeSymptomRequest, type SearchHospitalsRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAnalyzeSymptom() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeSymptomRequest) => {
      // Input validation using Zod schema from routes
      const validated = api.symptoms.analyze.input.parse(data);

      const res = await fetch(api.symptoms.analyze.path, {
        method: api.symptoms.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const error = await res.json();
        // If detailed error is available, use it. Otherwise use the message.
        const errorMessage = error.error || error.message || "Analiz sırasında bir hata oluştu";
        throw new Error(errorMessage);
      }

      return api.symptoms.analyze.responses[200].parse(await res.json());
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useHospitals(params: SearchHospitalsRequest | null) {
  return useQuery({
    queryKey: [api.hospitals.list.path, params],
    queryFn: async () => {
      if (!params) return [];

      const queryParams = new URLSearchParams({
        lat: params.lat.toString(),
        lng: params.lng.toString(),
        radius: params.radius.toString(),
      });

      const res = await fetch(`${api.hospitals.list.path}?${queryParams}`);

      if (!res.ok) {
        throw new Error("Hastaneler listelenirken bir hata oluştu");
      }

      return api.hospitals.list.responses[200].parse(await res.json());
    },
    enabled: !!params, // Only fetch when params are available (e.g. location found)
  });
}
