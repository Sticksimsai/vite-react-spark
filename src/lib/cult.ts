import { coins } from '@/lib/demo';

export type CultBadge = 'founder' | 'og' | 'top 10';

export type CultHolder = {
  address: string;
  handle?: string;
  avatar?: string;
  initials: string;
  badges: CultBadge[];
  holdingPercent: number;
  rewardedEth: number;
  pnlPercent: number | null;
  holdingSince: string;
  member: boolean;
};

export type Cult = {
  members: CultHolder[];
  holders: CultHolder[];
  memberSupplyPercent: number;
};

const identities = [
  ['@softserve', '/demo/goodmorning.svg'],
  ['@orbiting', '/demo/orbit.svg'],
  ['@evergreen', '/demo/evergreen.svg'],
  ['@lowtide', '/demo/tidepool.svg'],
  ['@nightowl', '/demo/nightshift.svg'],
  ['@commonfolk', '/demo/common.svg'],
  ['@lemondrop', '/demo/lemonade.svg'],
  ['@signalboost', '/demo/signal.svg'],
] as const;

function seedFrom(value: string) {
  let seed = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    seed ^= value.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function generator(seed: number) {
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function addressFor(coinId: string, index: number) {
  const random = generator(seedFrom(`${coinId}:holder:${index}`));
  let address = '0x';
  for (let i = 0; i < 40; i += 1) address += Math.floor(random() * 16).toString(16);
  return address;
}

export function getCult(coinId: string): Cult {
  const random = generator(seedFrom(coinId));
  const coin = coins.find((item) => item.id === coinId);
  const founder = coin?.creator ?? '@founder';
  const holdingLabels = ['6d', '5d', '3d', '2d', '18h', '11h', '7h', '3h', '54m', '22m'];
  const holdings = [8.42, 6.18, 4.76, 3.51, 2.84, 2.11, 1.68, 1.24, 0.91, 0.63];

  const holders = holdings.map((baseHolding, index): CultHolder => {
    const identity = identities[index % identities.length];
    const member = index < 7;
    const holdingPercent = Number((baseHolding * (0.9 + random() * 0.2)).toFixed(2));
    const pnl = index === 3 || index === 8 ? null : Number(((random() - 0.35) * 165).toFixed(1));
    const handle = index === 0 ? founder : member ? identity?.[0] : undefined;
    const initials = (handle ?? `H${index + 1}`).replace('@', '').slice(0, 2).toUpperCase();
    const badges: CultBadge[] = [];
    if (index === 0) badges.push('founder');
    if (index < 3) badges.push('og');
    if (index < 10) badges.push('top 10');

    return {
      address: addressFor(coinId, index),
      handle,
      avatar: member && index !== 0 ? identity?.[1] : undefined,
      initials,
      badges,
      holdingPercent,
      rewardedEth: Number((holdingPercent * (0.012 + random() * 0.035)).toFixed(4)),
      pnlPercent: pnl,
      holdingSince: holdingLabels[index] ?? '1h',
      member,
    };
  });

  const members = holders.filter((holder) => holder.member);
  return {
    members,
    holders,
    memberSupplyPercent: Number(members.reduce((total, holder) => total + holder.holdingPercent, 0).toFixed(1)),
  };
}