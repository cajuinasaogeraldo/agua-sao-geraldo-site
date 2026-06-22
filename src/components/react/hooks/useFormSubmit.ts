import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  buildFormData,
  FormSubmissionError,
  getErrorToastTitle,
  getFormSubmissionErrorMessage,
  isRecaptchaSubmissionError,
  submitFormData,
} from '@/components/react/common/form-submission';

interface UseFormSubmitOptions {
  apiUrl?: string;
  formId: string;
  onSuccess?: () => void;
}

export function useFormSubmit({ apiUrl, formId, onSuccess }: UseFormSubmitOptions) {
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>, token: string | null) => {
      setRecaptchaError(null);

      try {
        const formData = buildFormData(data, {
          captchaToken: token,
          formId,
          origin: globalThis.location.origin,
        });
        await submitFormData(apiUrl, formData, formId);

        toast.success('Formulario enviado com sucesso!', {
          duration: 6000,
        });
        onSuccess?.();
        return { success: true as const, fieldErrors: undefined };
      } catch (error) {
        if (isRecaptchaSubmissionError(error)) {
          const message = getFormSubmissionErrorMessage(error);
          setRecaptchaError(message);
          toast.error('Verificacao de seguranca', {
            description: message,
          });
          return { success: false as const, fieldErrors: undefined };
        }

        const title =
          error instanceof FormSubmissionError ? getErrorToastTitle(error) : 'Erro ao enviar';
        const description = getFormSubmissionErrorMessage(error);
        toast.error(title, { description });

        const fieldErrors = error instanceof FormSubmissionError ? error.fieldErrors : undefined;

        return { success: false as const, fieldErrors };
      }
    },
    [apiUrl, formId, onSuccess],
  );

  return { submit, recaptchaError };
}
