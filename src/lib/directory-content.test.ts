import { describe, expect, it } from 'vitest';
import { filterListings, listings, services } from './directory-content';

describe('Current Rohit Samaj directory content', () => {
  it('contains the original India listing without fictional businesses', () => {
    expect(filterListings('India', 'All', '', 'All locations').map(item => item.name)).toEqual(['Shree Sai Survey']);
    expect(listings.map(item => item.name)).toEqual(['Shree Sai Survey', 'Arun Parmar', 'J.Y. School of Motoring', 'VM IT Solution']);
  });
  it('returns the original UK businesses independently of India', () => {
    expect(filterListings('UK', 'All', '', 'All locations').map(item => item.name)).toEqual(['Arun Parmar', 'J.Y. School of Motoring', 'VM IT Solution']);
    expect(filterListings('UK', 'IT Services', '', 'All locations').map(item => item.name)).toEqual(['VM IT Solution']);
  });
  it('uses source-attributed regional services', () => {
    expect(services.filter(item => item.country === 'India')).toHaveLength(27);
    expect(services.filter(item => item.country === 'UK')).toHaveLength(28);
    expect(services.every(item => item.sourceUrl.startsWith('https://rohitsamaj.com/'))).toBe(true);
  });
  it('preserves real survey contacts and does not manufacture UK reviews', () => {
    expect(listings.find(item => item.name === 'Shree Sai Survey')?.phone).toBe('09825541011');
    expect(listings.filter(item => item.country === 'UK').map(item => item.rating)).toEqual([null, null, null]);
  });
});