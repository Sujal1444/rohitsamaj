import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Coffee, Globe2, Heart, Hotel, LayoutTemplate, MapPin, Menu, Plus, Search, ShoppingBag, Star, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { heroImage, services, listings, filterListings, type Listing } from '@/lib/directory-content';

const designs = [
  { id: 'natural', label: 'Local & Natural', eyebrow: 'LOCAL DISCOVERIES. REAL CONNECTIONS.', line: 'Your community.', accent: 'Closer than ever.', description: 'Discover local businesses, favourite places, and the people who make your neighbourhood feel like home.' },
  { id: 'editorial', label: 'Bold & Editorial', eyebrow: 'THE ROHIT SAMAJ LOCAL EDIT', line: 'Extraordinary places.', accent: 'Everyday connections.', description: 'A new perspective on your neighbourhood. Discover the businesses, places, and people worth knowing.' },
  { id: 'modern', label: 'Clean & Modern', eyebrow: 'YOUR LOCAL BUSINESS DIRECTORY', line: 'Find local.', accent: 'Connect better.', description: 'From everyday essentials to hidden gems, find the right business in your community.' },
];

function Brand() {
  return <a href="#home" className="brand" aria-label="Rohit Samaj home"><span className="brand-mark">r.</span><div><div className="brand-name">rohit<span>samaj</span></div><div className="brand-caption">Connecting our community</div></div></a>;
}

export function DesignSamples() {
  const [designIndex, setDesignIndex] = useState(1);
  const [region, setRegion] = useState('India');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All locations');
  const [search, setSearch] = useState({ query: '', city: 'All locations' });
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [saved, setSaved] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<'about' | 'contact' | 'account' | 'listing' | null>(null);
  const [detail, setDetail] = useState<Listing | null>(null);
  const design = designs[designIndex];
  const countryServices = services.filter(item => item.country === region);
  const countryListings = listings.filter(item => item.country === region);
  const locations = [...new Set(countryListings.map(item => item.city))];
  const categories = region === 'India' ? [{ name: 'Automotive', icon: BriefcaseBusiness }, { name: 'Cafe', icon: Coffee }, { name: 'Hotels', icon: Hotel }, { name: 'Shopping', icon: ShoppingBag }, { name: 'Education', icon: BriefcaseBusiness }, { name: 'Health & Beauty', icon: Heart }] : [{ name: 'Handy Man', icon: BriefcaseBusiness }, { name: 'Autommotor', icon: BriefcaseBusiness }, { name: 'IT Services', icon: Globe2 }, { name: 'Cafe', icon: Coffee }, { name: 'Hotels', icon: Hotel }, { name: 'Health & Beauty', icon: Heart }];
  const filtered = filterListings(region, category, search.query, search.city);
  const visible = sort === 'Top rated' ? [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)) : filtered;
  const hasFilter = category !== 'All' || search.query !== '' || search.city !== 'All locations';
  function jumpToListings() { document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' }); }
  function selectCategory(value: string) { setCategory(value); jumpToListings(); }
  function clearFilters() { setCategory('All'); setQuery(''); setCity('All locations'); setSearch({ query: '', city: 'All locations' }); }

  if (!design) return null;

  return <>
    <div className="preview-bar">
      <div className="preview-brand"><LayoutTemplate aria-hidden="true" /> Design collection <span>Rohit Samaj</span></div>
      <div className="preview-tabs" role="tablist" aria-label="Website design samples">{designs.map((item, index) => <Button key={item.id} role="tab" aria-selected={designIndex === index} variant="preview" data-active={designIndex === index} onClick={() => setDesignIndex(index)}><span>0{index + 1}</span> {item.label}</Button>)}</div>
      <div className="preview-note"><i /> Interactive design samples</div>
    </div>
    <div className={`website theme-${design.id}`}>
      <header id="home" className="site-header container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#home">Home</a><a href="#listings" onClick={clearFilters}>Explore listings</a><a href="#about" onClick={event => { event.preventDefault(); setDialog('about'); }}>About us</a><a href="#contact" onClick={event => { event.preventDefault(); setDialog('contact'); }}>Contact</a></nav>
        <div className="header-actions"><Globe2 className="size-4" aria-hidden="true" /><select aria-label="Country" className="region-select" value={region} onChange={event => { setRegion(event.target.value); clearFilters(); }}><option>India</option><option>UK</option></select><Button variant="navigation" className="sign-in" onClick={() => setDialog('account')}>Sign in</Button><Button className="header-add" onClick={() => setDialog('listing')}><Plus /> Add a listing</Button><Button variant="navigation" size="icon" className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
      </header>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#listings" onClick={() => setMenuOpen(false)}>Explore</a><a href="#about" onClick={event => { event.preventDefault(); setDialog('about'); setMenuOpen(false); }}>About</a><a href="#contact" onClick={event => { event.preventDefault(); setDialog('contact'); setMenuOpen(false); }}>Contact</a><Button variant="navigation" onClick={() => setDialog('account')}>Sign in</Button></nav>}
      <main>
        <section className="hero" aria-label="Discover Rohit Samaj">
          <img className="hero-photo" src={heroImage} alt="Resort and swimming pool shown on the Rohit Samaj website" width={1600} height={755} />
          <div className="container hero-content"><div className="eyebrow hero-eyebrow">{design.eyebrow}</div><h1>{design.line}<br /><em>{design.accent}</em></h1><p className="hero-description">{design.description}</p>
            <form className="search-bar" onSubmit={event => { event.preventDefault(); setSearch({ query: query.trim(), city }); setCategory('All'); jumpToListings(); }}><label className="search-field"><Search aria-hidden="true" /><input aria-label="Search businesses" placeholder="What are you looking for?" value={query} onChange={event => setQuery(event.target.value)} /></label><label className="search-field location-field"><MapPin aria-hidden="true" /><select aria-label="Location" value={city} onChange={event => setCity(event.target.value)}><option>All locations</option>{locations.map(location => <option key={location}>{location}</option>)}</select></label><Button variant="hero" type="submit"><Search /> Search listings</Button></form>
            <div className="popular-searches"><span>Popular searches:</span>{(region === 'India' ? ['Automotive', 'Cafe', 'Hotels'] : ['Handy Man', 'Autommotor', 'IT Services']).map(name => <a key={name} href="#listings" onClick={() => selectCategory(name)}>{name}</a>)}</div>
          </div>
        </section>
        <div className="community-band"><div className="container community-inner"><div className="community-copy"><Users /> Local businesses. A stronger community.</div><div className="community-details"><span><Globe2 /> India & United Kingdom</span><span><Heart /> Community-first connections</span><span><Search /> Discover something local</span></div></div></div>
        <section className="categories container" aria-labelledby="category-title"><div className="section-heading"><div><h2 id="category-title">A little of everything, nearby.</h2><p>Find just what you need, from people you can connect with.</p></div><a className="text-link" href="#listings" onClick={() => setCategory('All')}>Explore all <ArrowRight /></a></div><div className="category-grid">{categories.map(item => <Button key={item.name} variant="outline" className="category-button" data-active={category === item.name} onClick={() => selectCategory(item.name)}><item.icon />{item.name}</Button>)}</div></section>
        <section id="listings" className="listings-section container" aria-labelledby="listings-title"><div className="section-heading"><div><h2 id="listings-title">{hasFilter ? 'Your local discoveries' : `Listings ${region}`}</h2><p>{hasFilter ? 'Find the right connection for you.' : 'Explore businesses and places from our community.'}</p></div><div className="listing-tools"><select aria-label="Sort listings" className="filter-select" value={sort} onChange={event => setSort(event.target.value)}><option>Featured</option><option>Top rated</option></select><a className="text-link" href="#listings" onClick={clearFilters}>View all listings <ArrowRight /></a></div></div>
          {hasFilter && <div className="results-label" role="status"><span>{visible.length} {visible.length === 1 ? 'listing' : 'listings'} found{category !== 'All' ? ` · ${category}` : ''}</span><Button variant="ghost" className="clear-button" onClick={clearFilters}>Clear filters <X /></Button></div>}
          {visible.length === 0 ? <div className="empty-state"><Search className="mx-auto mb-3 size-6" /><p>No listings match your search.</p><Button variant="outline" onClick={clearFilters}>Explore all listings</Button></div> : <div className="listing-grid">{visible.map(item => <article className="listing-card" key={item.id}><div className="listing-image"><img src={item.image} alt={item.name} width={300} height={300} loading="lazy" /><span className="listing-tag">Popular</span><Button variant="ghost" size="icon" className="save-button" aria-label={`${saved.includes(item.id) ? 'Unsave' : 'Save'} ${item.name}`} aria-pressed={saved.includes(item.id)} onClick={() => setSaved(previous => previous.includes(item.id) ? previous.filter(id => id !== item.id) : [...previous, item.id])}><Heart fill={saved.includes(item.id) ? 'currentColor' : 'none'} /></Button></div><div className="listing-body"><div className="listing-meta"><span>{item.category}</span><span className="listing-rating">{item.rating !== null ? <><Star /> {item.rating.toFixed(1)} <span className="text-muted-foreground">({item.reviews})</span></> : <span className="text-muted-foreground">No reviews yet</span>}</span></div><h3 className="listing-title"><a href="#business" onClick={event => { event.preventDefault(); setDetail(item); }}>{item.name}</a></h3><div className="listing-location"><MapPin />{item.city}{item.city === 'United Kingdom' ? '' : `, ${item.country}`}</div><div className="listing-footer"><span>{item.phone ? <a href={`tel:${item.phone}`}>{item.phone}</a> : item.category}</span><Button variant="navigation" className="detail-button" onClick={() => setDetail(item)}>View details <ArrowUpRight /></Button></div></div></article>)}</div>}
        </section>
        <section id="services" className="services-section container" aria-labelledby="services-title"><div className="section-heading"><div><h2 id="services-title">Services for you</h2><p>Professional services designed around you.</p></div><span className="text-link">{region}</span></div><div className="service-photo-grid">{countryServices.map(service => <a className="service-photo-card" key={`${service.country}-${service.name}`} href={service.sourceUrl} target="_blank" rel="noreferrer"><img src={service.image} alt={service.name} width={300} height={200} loading="lazy" /><span>{service.name}<ArrowUpRight /></span></a>)}</div></section>
        <section className="business-band"><div className="container business-inner"><div><div className="eyebrow text-primary">FOR LOCAL BUSINESS OWNERS</div><h2>Your business belongs here.</h2><p>Be discovered. Build connections. Grow with your community.</p></div><Button size="lg" onClick={() => setDialog('listing')}><Plus /> Add your business <ArrowRight /></Button></div></section>
      </main>
      <footer className="site-footer container"><Brand /><p>© 2026 Rohit Samaj. All rights reserved.</p><div className="footer-links"><a href="#about" onClick={event => { event.preventDefault(); setDialog('about'); }}>About us</a><a href="#contact" onClick={event => { event.preventDefault(); setDialog('contact'); }}>Get in touch <ArrowUpRight className="inline size-3" /></a></div></footer>
      <Dialog open={dialog !== null} onOpenChange={open => { if (!open) setDialog(null); }}><DialogContent><DialogTitle>{dialog === 'about' ? 'Our community, connected.' : dialog === 'contact' ? 'Get in touch' : dialog === 'account' ? 'Welcome to Rohit Samaj' : 'Bring your business to the community'}</DialogTitle><DialogDescription className="dialog-description">{dialog === 'about' ? 'Rohit Samaj connects communities with local businesses and professionals across India and the United Kingdom. Our mission is to make local information accessible, reliable, and easy to find.' : dialog === 'contact' ? 'Contact the Rohit Samaj team using the details published on the existing website.' : 'This is a redesign sample. Account access and business submissions are not connected; use the existing website for these services.'}</DialogDescription>{dialog === 'contact' ? <div className="detail-facts"><p>Leicester, United Kingdom</p><a className="text-primary" href="mailto:milaycomputer@hotmail.com">milaycomputer@hotmail.com</a><p><a href="tel:+447868607915">+44 7868 607915</a></p></div> : dialog !== 'about' ? <Button asChild><a href="https://rohitsamaj.com/en-us/home-in/" target="_blank" rel="noreferrer">Visit the existing website <ArrowUpRight /></a></Button> : <div className="flex items-center gap-2 text-sm text-primary"><Users className="size-5" /> Stronger together.</div>}</DialogContent></Dialog>
      <Dialog open={detail !== null} onOpenChange={open => { if (!open) setDetail(null); }}><DialogContent>{detail && <><DialogTitle>{detail.name}</DialogTitle><DialogDescription>{detail.description}</DialogDescription><img className="detail-photo" src={detail.image} alt={detail.name} width={300} height={300} /><div className="detail-facts"><p><MapPin className="inline size-4" /> {detail.address}</p><p>{detail.category}{detail.rating !== null ? ` · ★ ${detail.rating.toFixed(1)} (${detail.reviews} review)` : ' · No reviews yet'}</p>{detail.phone && <p><a className="text-primary" href={`tel:${detail.phone}`}>{detail.phone}</a></p>}<ul className="list-disc pl-5">{detail.serviceDetails.map(service => <li key={service}>{service}</li>)}</ul><a className="text-link mt-4" href={detail.sourceUrl} target="_blank" rel="noreferrer">View original listing <ArrowUpRight /></a></div><Button variant="outline" onClick={() => setSaved(previous => previous.includes(detail.id) ? previous.filter(id => id !== detail.id) : [...previous, detail.id])}>{saved.includes(detail.id) ? <Check /> : <Heart />}{saved.includes(detail.id) ? 'Saved to favourites' : 'Save to favourites'}</Button></>}</DialogContent></Dialog>
    </div>
  </>;
}