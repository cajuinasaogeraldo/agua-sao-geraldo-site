import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="relative">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm hide-scrollbar">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:p-12 hide-scrollbar">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300"
          >
            <X size={24} />
          </button>
          <div className="prose [&_h4]:font-inter! prose-sm md:prose-base font-inter max-w-none">
            <h3 className="text-agua-primary-blue mb-6 text-xl font-bevan font-bold!">
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
              onClick={onClose}
              className="btn-secondary rounded-lg px-6 py-2 font-semibold text-white transition-colors"
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
