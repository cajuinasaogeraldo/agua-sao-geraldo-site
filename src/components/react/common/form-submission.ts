const DEFAULT_FORM_ERROR_MESSAGE = 'Nao foi possivel enviar o formulario.';
const CONFIGURATION_FORM_ERROR_MESSAGE =
  'Nao foi possivel enviar sua solicitacao agora. Tente novamente mais tarde.';
const NETWORK_FORM_ERROR_MESSAGE =
  'Nao foi possivel enviar sua solicitacao agora. Tente novamente em instantes.';
const VALIDATION_FORM_ERROR_MESSAGE = 'Confira os dados preenchidos e tente novamente.';
const RECAPTCHA_FORM_ERROR_MESSAGE = 'Confirme a verificacao de seguranca e tente novamente.';
const LARGE_UPLOAD_ERROR_MESSAGE = 'Envie um arquivo menor e tente novamente.';
const RATE_LIMIT_FORM_ERROR_MESSAGE = 'Aguarde um instante e tente novamente.';
const SERVER_FORM_ERROR_MESSAGE =
  'Ocorreu um erro ao enviar sua solicitacao. Tente novamente mais tarde.';

const ERROR_CODE_MESSAGES: Record<string, string> = {
  CAPTCHA_TOKEN_OBRIGATORIO: 'Confirme a verificacao de seguranca.',
  CAPTCHA_INVALIDO: 'Verificacao de seguranca invalida. Tente novamente.',
  TOO_MANY_FILES: 'Numero maximo de arquivos excedido. Envie menos anexos.',
};

interface ErrorResponseBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  cause?: string;
}

type FormSubmissionErrorKind = 'configuration' | 'network' | 'recaptcha' | 'response';

export class FormSubmissionError extends Error {
  readonly kind: FormSubmissionErrorKind;
  readonly status?: number;
  readonly details?: unknown;
  readonly fieldErrors?: Record<string, string>;

  constructor({
    userMessage,
    kind,
    status,
    details,
    fieldErrors,
  }: {
    userMessage: string;
    kind: FormSubmissionErrorKind;
    status?: number;
    details?: unknown;
    fieldErrors?: Record<string, string>;
  }) {
    super(userMessage);
    this.name = 'FormSubmissionError';
    this.kind = kind;
    this.status = status;
    this.details = details;
    this.fieldErrors = fieldErrors;
  }
}

export function buildFormData(
  data: Record<string, unknown>,
  options: {
    captchaToken?: string | null;
    formId: string;
    origin: string;
  },
) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    appendFormDataValue(formData, key, value);
  });

  formData.append('captchaToken', options.captchaToken || '');
  formData.append('formId', options.formId);
  formData.append('_origin', options.origin);

  return formData;
}

export async function submitFormData(
  apiUrl: string | undefined,
  formData: FormData,
  formId: string,
) {
  if (!apiUrl) {
    throw new FormSubmissionError({
      userMessage: CONFIGURATION_FORM_ERROR_MESSAGE,
      kind: 'configuration',
    });
  }

  try {
    const response = await fetch(resolveFormSubmitUrl(apiUrl), {
      method: 'POST',
      headers: {
        'x-siteform-id': formId,
      },
      body: formData,
    });

    if (response.ok) {
      return;
    }

    let body: ErrorResponseBody | undefined;
    try {
      body = await response.json();
    } catch {
      // no body to parse
    }

    const statusError = getErrorFromStatus(response.status, body);

    throw new FormSubmissionError({
      userMessage: statusError.userMessage,
      kind: statusError.kind,
      status: response.status,
      fieldErrors: statusError.fieldErrors,
    });
  } catch (error) {
    if (error instanceof FormSubmissionError) {
      throw error;
    }

    throw new FormSubmissionError({
      userMessage: NETWORK_FORM_ERROR_MESSAGE,
      kind: 'network',
      details: error,
    });
  }
}

export function getFormSubmissionErrorMessage(error: unknown) {
  if (error instanceof FormSubmissionError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return DEFAULT_FORM_ERROR_MESSAGE;
}

export function isRecaptchaSubmissionError(error: unknown) {
  return error instanceof FormSubmissionError && error.kind === 'recaptcha';
}

export function getErrorToastTitle(error: FormSubmissionError): string {
  if (error.kind === 'recaptcha') {
    return 'Verificacao de seguranca';
  }

  if (error.kind === 'network') {
    return 'Erro de conexao';
  }

  if (error.kind === 'configuration') {
    return 'Servico indisponivel';
  }

  return getToastTitleByStatus(error.status);
}

function getToastTitleByStatus(status?: number): string {
  switch (status) {
    case 400:
    case 422:
      return 'Dados invalidos';
    case 401:
    case 403:
      return 'Acesso negado';
    case 404:
      return 'Nao encontrado';
    case 413:
      return 'Arquivo muito grande';
    case 429:
      return 'Muitas tentativas';
    default:
      if (status && status >= 500) {
        return 'Erro no servidor';
      }
      return 'Erro ao enviar';
  }
}

function appendFormDataValue(formData: FormData, key: string, value: unknown) {
  if (value === null || value === undefined) {
    return;
  }

  if (isFileList(value)) {
    Array.from(value).forEach((file) => {
      formData.append(key, file);
    });
    return;
  }

  if (isFile(value) || isBlob(value)) {
    formData.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendFormDataValue(formData, key, item));
    return;
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  if (typeof value === 'boolean') {
    formData.append(key, value ? 'true' : 'false');
    return;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    formData.append(key, String(value));
    return;
  }

  formData.append(key, JSON.stringify(value));
}

function getErrorFromStatus(
  status: number,
  body?: ErrorResponseBody,
): {
  kind: FormSubmissionErrorKind;
  userMessage: string;
  fieldErrors?: Record<string, string>;
} {
  const errorCode = Array.isArray(body?.message) ? body.message[0] : body?.message;

  if (errorCode === 'FILE_TOO_LARGE') {
    const fileName = body?.cause || 'desconhecido';
    return {
      kind: 'response',
      userMessage: `Arquivo "${fileName}" muito grande. Envie um arquivo menor.`,
    };
  }

  if (errorCode && errorCode in ERROR_CODE_MESSAGES) {
    return {
      kind: errorCode.startsWith('CAPTCHA') ? 'recaptcha' : 'response',
      userMessage: ERROR_CODE_MESSAGES[errorCode],
    };
  }

  const fieldErrors = extractNestjsFieldErrors(body?.message);
  if (fieldErrors) {
    return {
      kind: 'response',
      userMessage: 'Confira os campos destacados e tente novamente.',
      fieldErrors,
    };
  }

  if (errorCode) {
    return {
      kind: 'response',
      userMessage: DEFAULT_FORM_ERROR_MESSAGE,
    };
  }

  switch (status) {
    case 400:
    case 422:
      return {
        kind: 'response',
        userMessage: VALIDATION_FORM_ERROR_MESSAGE,
      };
    case 401:
    case 403:
      return {
        kind: 'recaptcha',
        userMessage: RECAPTCHA_FORM_ERROR_MESSAGE,
      };
    case 413:
      return {
        kind: 'response',
        userMessage: LARGE_UPLOAD_ERROR_MESSAGE,
      };
    case 429:
      return {
        kind: 'response',
        userMessage: RATE_LIMIT_FORM_ERROR_MESSAGE,
      };
    default:
      if (status >= 500) {
        return {
          kind: 'response',
          userMessage: SERVER_FORM_ERROR_MESSAGE,
        };
      }

      return {
        kind: 'response',
        userMessage: DEFAULT_FORM_ERROR_MESSAGE,
      };
  }
}

function extractNestjsFieldErrors(
  message: string | string[] | undefined,
): Record<string, string> | undefined {
  if (!message) return undefined;

  const messages = Array.isArray(message) ? message : [message];
  const fieldErrors: Record<string, string> = {};
  const invalidFieldPattern = /^property\s+(\w+)\s+should not exist/i;

  for (const msg of messages) {
    const fieldMatch = invalidFieldPattern.exec(msg);
    if (fieldMatch) {
      fieldErrors[fieldMatch[1]] = 'Campo invalido';
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

function isFileList(value: unknown): value is FileList {
  return typeof FileList !== 'undefined' && value instanceof FileList;
}

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function isBlob(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function resolveFormSubmitUrl(apiUrl: string) {
  return `${apiUrl}/submit`;
}
