import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return;
    }

    const previousFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
      previousFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="relative">
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm hide-scrollbar"
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-policy-modal-title"
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:p-12 hide-scrollbar"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar janela modal"
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-primary-blue"
          >
            <X aria-hidden="true" size={24} />
          </button>
          <div className="prose [&_h4]:font-inter! prose-sm md:prose-base font-inter max-w-none">
            <h3
              id="privacy-policy-modal-title"
              className="text-agua-primary-blue mb-6 text-xl font-bevan font-bold!"
            >
              Política de Privacidade e Proteção de Dados
            </h3>

            <p>
              A Cajuína São Geraldo tem o compromisso de proteger a sua privacidade e seus dados
              pessoais. Esta política descreve como coletamos, usamos e protegemos suas informações.
            </p>
            <br />
            <h4>1. Coleta de Dados</h4>
            <p>
              Coletamos informações que você nos fornece diretamente ao preencher nossos
              formulários, como nome, e-mail, telefone e informações sobre sua solicitação.
            </p>
            <br />
            <h4>2. Uso dos Dados</h4>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc clear-both [&_li]:ml-5 *:text-xsm">
              <li>Processar e responder às suas solicitações de parceria, patrocínio ou doação;</li>
              <li>Entrar em contato com você sobre o status da sua solicitação;</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
            <br />
            <h4>3. Seus Direitos</h4>
            <p>
              Você tem direito a acessar, corrigir ou solicitar a exclusão de seus dados pessoais.
              Para exercer esses direitos, entre em contato conosco.
            </p>
            <br />
            <h4>4. Segurança</h4>
            <p>
              Adotamos medidas de segurança técnicas e organizacionais para proteger seus dados
              contra acesso não autorizado, perda ou alteração.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary rounded-lg px-6 py-2 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-primary-blue"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
