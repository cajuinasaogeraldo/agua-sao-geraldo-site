import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-left"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        classNames: {
          error: 'border-red-500 mb-16',
          success: 'border-green-500 mb-16',
          warning: 'border-yellow-500 mb-16',
          info: 'border-blue-500 mb-16',
        },
      }}
    />
  );
}
