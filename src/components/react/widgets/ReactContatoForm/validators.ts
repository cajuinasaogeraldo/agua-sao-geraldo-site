import { z } from 'zod';

export const contatoFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  whatsapp: z.string().min(1, 'Telefone é obrigatório'),
  uf: z.string().min(1, 'UF é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  message: z.string().min(1, 'Digite sua mensagem'),
  acceptance: z.coerce.boolean().refine((val) => val === true, {
    message: ' Vocé precisa aceitar a política',
  }),
  _origin: z.string().default('Água Mineral São Geraldo'),
});

export type ContatoFormData = z.infer<typeof contatoFormSchema>;
