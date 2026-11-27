import type { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<TFormData extends Record<string, any>> {
  register: UseFormRegister<TFormData>;
  errors: FieldErrors<TFormData>;
  name: Path<TFormData>;
  label?: React.ReactNode | null;
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'file'
    | 'checkbox'
    | 'date'
    | 'time'
    | 'number';
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  hideLabel?: boolean;
  accept?: string;
  multiple?: boolean;
  rows?: number;
  className?: string;
  fileList?: FileList | null;
}

const AUTOCOMPLETE: Record<string, string> = {
  name: 'name',
  email: 'email',
  whatsapp: 'tel',
  city: 'address-level2',
  eventCity: 'off',
  cidadeAtuacao: 'off',
  razaoSocial: 'organization',
};

const INPUT_MODE: Record<string, 'tel' | 'email' | 'numeric'> = {
  tel: 'tel',
  email: 'email',
  number: 'numeric',
};

export function FormField<TFormData extends Record<string, any>>({
  register,
  errors,
  name,
  label = null,
  type = 'text',
  placeholder,
  options,
  required = false,
  hideLabel = false,
  accept,
  multiple,
  rows = 6,
  className,
  fileList,
}: FormFieldProps<TFormData>) {
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  const uid = useId();
  const id = `${uid}-${name}`;
  const errorId = `${id}-error`;
  const selectFallbackLabel = options?.[0]?.label;
  const a11yProps = {
    id,
    'aria-invalid': errorMessage ? (true as const) : undefined,
    'aria-describedby': errorMessage ? errorId : undefined,
    'aria-required': required || undefined,
  };
  const errorProps = { id: errorId, role: 'alert' as const };

  // Adiciona asterisco vermelho no placeholder se obrigatório e sem label
  // Usamos um caractere especial para indicar obrigatoriedade
  const finalPlaceholder = !label && required && placeholder ? `${placeholder} *` : placeholder;

  const baseInputClasses =
    'w-full rounded-lg border border-gray-500 bg-white px-3 py-2 text-base font-semibold text-agua-primary-blue placeholder-gray-500 transition-all duration-200 focus:border-agua-primary-blue focus:outline-none focus:ring-2 focus:ring-agua-primary-blue/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-primary-blue md:px-4 md:py-3 md:text-lg';

  if (type === 'checkbox') {
    return (
      <div className={twMerge('w-full', className)}>
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            {...a11yProps}
            {...register(name)}
            className="text-agua-primary-blue focus:ring-agua-primary-blue/40 focus-visible:outline-agua-primary-blue mt-1 h-5 w-5 rounded border-gray-500 focus:ring-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          {label && <span className="text-agua-primary-blue text-sm select-none">{label}</span>}
        </label>
        {errorMessage && (
          <p {...errorProps} className="font-inter mt-1 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <div className={twMerge('w-full', className)}>
        {!hideLabel && label && type !== 'date' && type !== 'time' && type !== 'file' && (
          <label htmlFor={id} className="text-agua-primary-blue mb-2 block text-sm font-medium">
            {label}
            {required && (
              <span aria-hidden="true" className="text-red-600">
                {' '}
                *
              </span>
            )}
          </label>
        )}

        {type === 'textarea' ? (
          <textarea
            {...a11yProps}
            {...register(name)}
            rows={rows}
            maxLength={2000}
            placeholder={finalPlaceholder}
            className={twMerge(baseInputClasses, 'font-inter resize-y')}
          />
        ) : type === 'select' ? (
          <div className="relative">
            <select
              {...a11yProps}
              aria-label={!label ? selectFallbackLabel : undefined}
              {...register(name)}
              className={twMerge(baseInputClasses, 'font-inter appearance-none')}
            >
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        ) : type === 'file' ? (
          <>
            {!hideLabel && label && (
              <label htmlFor={id} className="text-agua-primary-blue mb-2 block text-sm font-medium">
                {label}
                {required && (
                  <span aria-hidden="true" className="text-red-600">
                    {' '}
                    *
                  </span>
                )}
                {fileList && fileList.length > 0 && (
                  <span className="font-normal text-gray-600">
                    {' '}
                    — Selecionado:{' '}
                    {(
                      Array.from(fileList).reduce((acc, f) => acc + f.size, 0) /
                      (1024 * 1024)
                    ).toFixed(2)}{' '}
                    MB
                  </span>
                )}
              </label>
            )}
            <input
              type="file"
              {...a11yProps}
              {...register(name)}
              multiple={multiple}
              accept={accept}
              className={twMerge(
                baseInputClasses,
                'font-inter file:mr-4 file:rounded-md file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800',
              )}
            />
          </>
        ) : type === 'date' ? (
          <>
            {!hideLabel && label && (
              <label htmlFor={id} className="text-agua-primary-blue mb-2 block text-sm font-medium">
                {label}
                {required && (
                  <span aria-hidden="true" className="text-red-600">
                    {' '}
                    *
                  </span>
                )}
              </label>
            )}
            <input
              type="date"
              {...a11yProps}
              {...register(name)}
              className={twMerge(baseInputClasses, 'font-inter')}
            />
          </>
        ) : type === 'time' ? (
          <>
            {!hideLabel && label && (
              <label htmlFor={id} className="text-agua-primary-blue mb-2 block text-sm font-medium">
                {label}
                {required && (
                  <span aria-hidden="true" className="text-red-600">
                    {' '}
                    *
                  </span>
                )}
              </label>
            )}
            <input
              type="time"
              {...a11yProps}
              {...register(name)}
              className={twMerge(baseInputClasses, 'font-inter')}
            />
          </>
        ) : (
          <input
            type={type}
            {...a11yProps}
            autoComplete={AUTOCOMPLETE[name as string]}
            inputMode={INPUT_MODE[type]}
            aria-label={!label ? placeholder : undefined}
            {...register(name)}
            maxLength={400}
            placeholder={finalPlaceholder}
            className={twMerge(baseInputClasses, 'font-inter')}
          />
        )}

        <div className="col-span-full w-full!">
          {errorMessage && (
            <p {...errorProps} className="font-inter mt-1 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
}
