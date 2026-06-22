import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contatoFormSchema, type ContatoFormData } from './validators';
import { GoogleReCaptchaProvider, GoogleReCaptchaCheckbox } from '@google-recaptcha/react';
import { PrivacyPolicyModal } from '../../common/PrivacyPolicyModal';
import { AllowedFormIds, ESTADOS_BRASIL } from '../../common/form-constants';
import { FormField } from '../../common/FormField';
import { useFormSubmit } from '../../hooks/useFormSubmit';

interface Props {
  onSubmitSuccess?: () => void;
  recaptchaSiteKey?: string;
  apiUrl?: string;
}

function Form({ onSubmitSuccess, apiUrl }: Readonly<Props>) {
  const [token, setToken] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [recaptchaInstanceKey, setRecaptchaInstanceKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoFormSchema),
  });

  const { submit, recaptchaError } = useFormSubmit({
    apiUrl,
    formId: AllowedFormIds.CONTATO_FORM,
    onSuccess: () => {
      onSubmitSuccess?.();
      setToken(null);
      setRecaptchaInstanceKey((previous) => previous + 1);
    },
  });

  const onSubmit = async (data: ContatoFormData) => {
    const result = await submit(data, token);
    if (result.success) {
      reset();
    } else if (result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof ContatoFormData, { message });
      });
    }
  };

  return (
    <div className="mx-auto w-full">
      <form
        id="contact_form"
        name="Formulário de Contato"
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl p-4 md:px-6 md:py-8 bg-white"
      >
        <div className="flex flex-col gap-8">
          {/* Informações  */}
          <div className="grid grid-cols-1 gap-4 [&_div>label]:text-xl! [&_div>label]:font-bold">
            <FormField
              register={register}
              errors={errors}
              name="name"
              type="text"
              label="Nome"
              placeholder="Digite aqui o seu nome"
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="email"
              type="text"
              label="Email"
              placeholder="Digite aqui o seu email"
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="whatsapp"
              type="text"
              label="WhatsApp"
              placeholder="Digite aqui o seu whatsapp"
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="city"
              type="text"
              label="Cidade"
              placeholder="Digite aqui a sua cidade"
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="uf"
              type="select"
              options={ESTADOS_BRASIL}
              label="UF"
              placeholder=""
              required
            />
            <FormField
              register={register}
              errors={errors}
              name="message"
              type="textarea"
              label="Mensagem"
              placeholder="Digite aqui a sua mensagem"
              required
            />
            {/* Termos */}
            <FormField
              register={register}
              errors={errors}
              name="acceptance"
              type="checkbox"
              label={
                <>
                  Declaro que li e aceito a{' '}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsPrivacyModalOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsPrivacyModalOpen(true)}
                    className="text-caju-heading-primary hover:text-caju-secondary-orange cursor-pointer font-semibold underline"
                  >
                    política de privacidade e proteção de dados
                  </span>
                  .
                </>
              }
              required
            />
          </div>
          {/* Submit Area*/}
          <div className="flex flex-wrap items-start justify-start w-full gap-4">
            {/* reCAPTCHA */}
            <div className="flex flex-col gap-1">
              <GoogleReCaptchaCheckbox
                key={recaptchaInstanceKey}
                onChange={setToken}
                action={AllowedFormIds.CONTATO_FORM}
                id="CONTATO_FORM"
              />
              {recaptchaError && <span className="text-[#d32f2f]/70">{recaptchaError}</span>}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full rounded-lg px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-80 md:px-8 md:py-4 md:text-lg"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </div>
      </form>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default function ReactContatoForm({ recaptchaSiteKey, apiUrl }: Props) {
  return (
    <GoogleReCaptchaProvider type="v2-checkbox" siteKey={recaptchaSiteKey!} isEnterprise>
      <Form apiUrl={apiUrl} />
    </GoogleReCaptchaProvider>
  );
}
