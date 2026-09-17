import { createFileRoute } from '@tanstack/react-router';
import Member from '@/pages/Member';

export const Route = createFileRoute('/m/$handle')({
  component: Member,
  head: () => ({
    meta: [
      { title: 'Member — CULT FUN' },
      { name: 'description', content: 'A CULT FUN member: their linked wallets, the cults they hold, rewards earned and PnL per coin.' },
      { property: 'og:title', content: 'Member — CULT FUN' },
      { property: 'og:description', content: 'A CULT FUN member: their linked wallets, the cults they hold, rewards earned and PnL per coin.' },
      { property: 'og:type', content: 'profile' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});
