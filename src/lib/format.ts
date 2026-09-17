import { formatEther } from 'viem';
export const shortAddr = (a: string) => a.length > 12 ? a.slice(0, 6) + '…' + a.slice(-4) : a;
export const eth = (wei: string | bigint, digits = 4) => { const v = formatEther(BigInt(wei)); const [w, p = ''] = v.split('.'); return p.length > digits ? `${w}.${p.slice(0, digits)}` : v; };
