# Plano de resposta a incidentes de segurança — Valtrea

Documento interno (LGPD, arts. 46 a 49; Resolução CD/ANPD nº 15/2024). Não publicar.

**Responsável:** João Adolfo Martins Araújo · contato@valtrea.com.br

## O que é um incidente

Qualquer acesso não autorizado, vazamento, perda ou alteração de dados pessoais. Exemplos aqui:
segredo da Cakto ou do Resend exposto; acesso indevido à conta Cloudflare, GitHub ou ao banco D1;
cookie de sessão do painel forjado; e-mail ou WhatsApp com conversas de clientes invadido.

## Passo a passo

1. **Conter (na hora).** Revogar e gerar de novo as chaves envolvidas (`wrangler secret put …`),
   trocar senhas, ativar/rever 2FA, derrubar sessões (trocar o segredo de assinatura das sessões),
   tirar do ar a rota afetada se preciso.
2. **Registrar.** Anotar data e hora da descoberta, o que aconteceu, quais dados, quantas pessoas,
   o que foi feito. Guardar logs e prints. Este registro precisa ser mantido por no mínimo 5 anos.
3. **Avaliar o risco.** O incidente pode causar risco ou dano relevante aos titulares? Pesa mais
   quando envolve CPF, dados de pagamento, dados de muitas pessoas, ou dados que permitam fraude.
4. **Comunicar (se houver risco relevante) em até 3 dias úteis** da ciência:
   - à ANPD, pelo formulário de comunicação de incidente em gov.br/anpd;
   - aos titulares afetados, por e-mail, em linguagem simples: o que aconteceu, quais dados,
     riscos, o que já foi feito e o que a pessoa pode fazer (ex.: ficar atenta a golpes por e-mail).
5. **Avisar fornecedores** envolvidos (Cakto, Cloudflare, GitHub, Resend) e seguir os
   procedimentos deles.
6. **Corrigir a causa** e revisar este plano.

## Contatos úteis

- ANPD: https://www.gov.br/anpd
- Cakto: suporte pela plataforma
- Cloudflare: painel → Support
- GitHub: https://support.github.com
