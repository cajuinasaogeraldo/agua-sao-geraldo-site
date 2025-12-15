import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contatoFormSchema, type ContatoFormData } from './validators';
import { GoogleReCaptchaProvider, GoogleReCaptchaCheckbox } from '@google-recaptcha/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { PrivacyPolicyModal } from '../../common/PrivacyPolicyModal';
import { AllowedFormIds, ESTADOS_BRASIL } from '../../common/form-constants';
import { FormField } from '../../common/FormField';

interface Props {
  onSubmitSuccess?: () => void;
  recaptchaSiteKey?: string;
  apiUrl?: string;
}

function Form({ onSubmitSuccess, apiUrl }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoFormSchema),
  });

  const onSubmit = async (data: ContatoFormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, val]) => {
        if (val !== null && typeof val !== 'boolean') {
          formData.append(key, String(val));
        } else if (typeof val === 'boolean') {
          formData.append(key, val ? 'true' : 'false');
        }
      });
      formData.append('captchaToken', token || '');
      formData.append('formId', AllowedFormIds.CONTATO_FORM);

      const response = await fetch(`${apiUrl}/forms/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (
          errorData.message &&
          (errorData.message.includes('reCAPTCHA') || errorData.message.includes('token'))
        ) {
          setRecaptchaError('Falha na validação do reCAPTCHA. Por favor, tente novamente.');
          return;
        }
        throw new Error('Falha ao enviar formulário', errorData);
      }

      alert('Formulário enviado com sucesso!');
      onSubmitSuccess?.();
      reset();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  };

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl p-4 md:px-6 md:py-8 bg-white">
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
              className="btn-yellow w-full rounded-lg px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-80 md:px-8 md:py-4 md:text-lg"
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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Form apiUrl={apiUrl} />
      </LocalizationProvider>
    </GoogleReCaptchaProvider>
  );
}
