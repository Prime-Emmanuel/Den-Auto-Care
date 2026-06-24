import React, { useState, useEffect } from 'react';
import { Product, INITIAL_PRODUCTS } from './types';
import AdminPanel from './components/AdminPanel';

const SERVICES = [
  { icon:'fas fa-shield-alt',   name:'Anti-Rust Chassis Cleaning', desc:'Complete undercarriage rust removal and protective coating.', details: 'Your car might be rusting without you knowing! We offer professional chassis cleaning and anti-rust protection. Benefits include: longer vehicle life, reduced repair costs, and safer driving. Currently on PROMO starting from 35,000 FCFA.' },
  { icon:'fas fa-stethoscope',  name:'Vehicle Diagnostics', desc:'Advanced electronic diagnostics to pinpoint issues fast and accurately.', details: 'Our advanced diagnostic service connects directly to your vehicle\'s onboard computer. We read fault codes, check live sensor data, and perform active tests. Necessary items: Bring your vehicle and any previous maintenance records. We will provide a full health report.' },
  { icon:'fas fa-wrench',       name:'Engine Repair',       desc:'Complete engine inspection, rebuild, and repair by certified mechanics.', details: 'From minor oil leaks to complete engine rebuilds, our certified mechanics handle it all. We inspect timing belts, gaskets, cylinders, and spark plugs. Necessary: A preliminary diagnostic is required to assess the exact engine fault before teardown.' },
  { icon:'fas fa-circle-notch', name:'Brake Service',       desc:'Brake pads, discs, calipers, and full fluid flush for your safety.', details: 'Your safety is our priority. We replace worn brake pads, resurface or replace rotors, and perform complete brake fluid flushes. Necessary: If you hear squeaking or feel grinding when braking, bring your car in immediately for a safety inspection.' },
  { icon:'fas fa-car-side',     name:'Suspension & Steering',desc:'Smooth rides with expert suspension tuning and wheel alignment.', details: 'We repair shocks, struts, tie rods, and control arms to restore your vehicle\'s handling. Necessary: Wheel alignment is highly recommended after any suspension work to prevent uneven tire wear.' },
  { icon:'fas fa-oil-can',      name:'Oil Change',          desc:'Scheduled oil & filter changes with quality synthetic or mineral oil.', details: 'Regular oil changes extend engine life. We drain old oil, replace the oil filter, and refill with premium synthetic or conventional oil. Necessary: Check your owner\'s manual for the recommended oil viscosity and change interval.' },
  { icon:'fas fa-bolt',         name:'Electrical Repair',   desc:'Battery, alternator, starter, wiring — all electrical systems covered.', details: 'We troubleshoot parasitic drains, replace dead batteries, fix alternators, and repair damaged wiring harnesses. Necessary: If your car struggles to start or lights dim, an electrical system test is the first step.' },
  { icon:'fas fa-snowflake',    name:'AC Service',          desc:'Refrigerant recharge, leak detection, and full A/C system overhaul.', details: 'Stay cool with our A/C service. We evacuate old refrigerant, vacuum test for leaks, and recharge the system with fresh Freon. Necessary: A UV dye test may be required if there is a slow, hard-to-find leak.' },
  { icon:'fas fa-cogs',         name:'Transmission',        desc:'Gearbox service, fluid change, and complete transmission diagnostics.', details: 'We service both automatic and manual transmissions. Services include fluid flushes, filter replacements, and clutch repairs. Necessary: Transmission issues can escalate quickly; bring it in at the first sign of slipping or rough shifting.' },
];

const marqueeNames = SERVICES.map(s => s.name);
const allMarqueeItems = [...marqueeNames, ...marqueeNames, ...marqueeNames, ...marqueeNames];

export default function App() {
  const [view, setView] = useState<'home' | 'shop' | 'admin'>('home');
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bookingConf, setBookingConf] = useState('');
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [highlightedService, setHighlightedService] = useState<string | null>(null);
  const [waModalData, setWaModalData] = useState<{ text: string } | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const prods: Product[] = [];
          querySnapshot.forEach((doc) => {
            prods.push({ id: doc.id, ...doc.data() } as Product);
          });
          setProducts(prods);
        }
      } catch (e) {
        console.error("Error fetching products", e);
      }
    };
    fetchProducts();
  }, []);

  const openWhatsApp = (number: string, text: string) => {
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    setWaModalData(null);
  };

  const [counters, setCounters] = useState({
    years: 0,
    cars: 0,
    emergency: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      animateCounters();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollUp(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (loading) return;
    
    let observer: IntersectionObserver | null = null;
    
    // Slight timeout to ensure elements are mounted before observing
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            observer?.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.rv').forEach(el => {
        // If element is already rendered and view switched, ensure it triggers or force it
        // Actually, observer will trigger immediately for elements in view. 
        // Just make sure we re-observe correctly.
        observer?.observe(el);
      });
      
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [loading, view]);

  const animateCounters = () => {
    const targets = { years: 7, cars: 50, emergency: 24, satisfaction: 95 };
    const dur = 1800;
    const steps = {
      years: targets.years / (dur / 16),
      cars: targets.cars / (dur / 16),
      emergency: targets.emergency / (dur / 16),
      satisfaction: targets.satisfaction / (dur / 16),
    };

    let cur = { years: 0, cars: 0, emergency: 0, satisfaction: 0 };
    
    const tick = () => {
      cur.years = Math.min(cur.years + steps.years, targets.years);
      cur.cars = Math.min(cur.cars + steps.cars, targets.cars);
      cur.emergency = Math.min(cur.emergency + steps.emergency, targets.emergency);
      cur.satisfaction = Math.min(cur.satisfaction + steps.satisfaction, targets.satisfaction);
      
      setCounters({
        years: Math.floor(cur.years),
        cars: Math.floor(cur.cars),
        emergency: Math.floor(cur.emergency),
        satisfaction: Math.floor(cur.satisfaction)
      });

      if (cur.years < targets.years || cur.cars < targets.cars || cur.emergency < targets.emergency || cur.satisfaction < targets.satisfaction) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const n = fd.get('name') as string;
    const p = fd.get('phone') as string;
    const c = fd.get('car') as string;
    const s = fd.get('service') as string;
    const d = fd.get('date') as string;
    const t = fd.get('time') as string;
    const m = fd.get('message') as string;

    const enc = encodeURIComponent;
    const msg = enc(
      `🗓️ *NEW BOOKING REQUEST* 🗓️\n\n` +
      `Hello D.E.N Auto Care! I would like to book an appointment.\n\n` +
      `👤 *Customer Details*\n` +
      `• *Name:* ${n}\n` +
      `• *Phone:* ${p}\n\n` +
      `🚘 *Vehicle & Service*\n` +
      `• *Car Model:* ${c}\n` +
      `• *Service Needed:* ${s}\n\n` +
      `⏰ *Preferred Schedule*\n` +
      `• *Date:* ${d}\n` +
      `• *Time:* ${t}` +
      (m ? `\n\n📝 *Additional Notes:*\n_${m}_` : '')
    );
    
    setWaModalData({ text: msg });
    
    setBookingConf('✓ Select a number to send your booking via WhatsApp!');
    e.currentTarget.reset();
    setTimeout(() => setBookingConf(''), 6000);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderShopFull = () => {
    return (
      <div className="catalog-page">
        <div className="inner">
          <div className="head-c mb-12 text-center rv" style={{ opacity: 1, transform: 'none' }}>
            <button className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '30px' }} onClick={() => { setView('home'); window.scrollTo(0, 0); }}>
              <i className="fas fa-arrow-left"></i> Back to Home
            </button>
            <div className="sec-tag" style={{ justifyContent: 'center' }}>Complete Catalog</div>
            <h2 className="sec-h">D.E.N <span className="red">Auto Parts & Fluids</span></h2>
            <div className="bar" style={{ margin: '14px auto 0' }}></div>
          </div>

          <div className="shop-grid">
            {products.map((p, i) => (
              <div key={i} className="shop-card">
                <div className="shop-img-wrap">
                  <div className="shop-badge">In Stock</div>
                  <img src={p.image} alt={p.name} className="shop-img" loading="lazy" />
                </div>
                <div className="shop-content">
                  <span className="shop-cat">{p.desc.split('(')[0].trim()}</span>
                  <h4 className="shop-name">{p.name}</h4>
                  <p className="shop-desc">{p.desc}</p>
                  <div className="shop-bot">
                    <span className="shop-price">{p.price}</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: `I'm interested in buying ${p.name}` }); }} className="btn-buy">
                      <i className="fab fa-whatsapp"></i> Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Preloader */}
      {loading && (
        <div id="preloader" className={!loading ? 'out' : ''}>
          <img src="https://i.ibb.co/1YP6ZbMq/Whats-App-Image-2026-04-24-at-16-08-43.jpg" alt="D.E.N Auto Care" className="pre-logo" />
          <div className="pre-track"><div className="pre-fill"></div></div>
        </div>
      )}

      {/* Floating Buttons */}
      <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: 'Hello, I need car assistance' }); }} className="fab-wa" aria-label="WhatsApp">
        <i className="fab fa-whatsapp"></i>
        <span className="fab-wa-tip">Need help?</span>
      </a>
      <a href="#" id="scrollUp" className={showScrollUp ? 'show' : ''} onClick={scrollToTop} aria-label="Back to top">
        <i className="fas fa-arrow-up"></i>
      </a>

      {/* Navigation */}
      <header id="nav" className={scrolled ? 'stuck' : ''}>
        <div className="nav-wrap">
          <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); setView('home'); }}>
            <img src="https://i.ibb.co/1YP6ZbMq/Whats-App-Image-2026-04-24-at-16-08-43.jpg" alt="D.E.N Auto Care" />
          </a>
          <ul className="nav-links">
            {view === 'home' ? (
              <>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#emergency">Emergency</a></li>
                <li><a href="#booking">Booking</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#admin" onClick={(e) => { e.preventDefault(); setView('admin'); }}>Admin</a></li>
              </>
            ) : (
              <>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }}>Back to Home</a></li>
              </>
            )}
          </ul>
          <a href="#booking" className="nav-btn" onClick={() => view === 'shop' && setView('home')}>Book Now</a>
          <button id="hamburger" aria-label="Open menu" onClick={openDrawer}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div id="overlay" className={drawerOpen ? 'on' : ''} onClick={closeDrawer}></div>
      <nav id="drawer" className={drawerOpen ? 'on' : ''}>
        <button id="closeDrawer" onClick={closeDrawer}><i className="fas fa-times"></i></button>
        <ul className="drawer-links">
          {view === 'home' ? (
            <>
              <li><a href="#home" className="dl" onClick={closeDrawer}>Home</a></li>
              <li><a href="#services" className="dl" onClick={closeDrawer}>Services</a></li>
              <li><a href="#shop" className="dl" onClick={closeDrawer}>Shop</a></li>
              <li><a href="#emergency" className="dl" onClick={closeDrawer}>Emergency</a></li>
              <li><a href="#booking" className="dl" onClick={closeDrawer}>Booking</a></li>
              <li><a href="#about" className="dl" onClick={closeDrawer}>About</a></li>
              <li><a href="#contact" className="dl" onClick={closeDrawer}>Contact</a></li>
              <li><a href="#admin" className="dl" onClick={(e) => { e.preventDefault(); setView('admin'); closeDrawer(); }}>Admin</a></li>
            </>
          ) : (
            <>
              <li><a href="#" className="dl" onClick={(e) => { e.preventDefault(); setView('home'); closeDrawer(); }}>Back to Home</a></li>
            </>
          )}
        </ul>
        <a href="#booking" className="drawer-cta dl" onClick={() => { closeDrawer(); view === 'shop' && setView('home'); }}>
          <i className="fas fa-calendar-check"></i> Book Appointment
        </a>
      </nav>

      {view === 'admin' ? (
        <AdminPanel products={products} setProducts={setProducts} />
      ) : view === 'shop' ? renderShopFull() : (
        <>
          {/* Hero */}
      <section id="home">
        <div id="hero">
          <div className={`hero-bg ${!loading ? 'loaded' : ''}`} id="heroBg"></div>
          <div className="hero-ov"></div>
          <div className="hero-grain"></div>
          <div className="hero-inner">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Trusted garage — Bonaberi, Douala</span>
            </div>
            <h1 className="hero-h1">
              Professional<br />
              Car <span className="red">Diagnostic</span><br />
              <span className="outline">&amp; Repair</span>
            </h1>
            <p className="hero-sub">Reliable automotive services in Douala Bonaberi — modern diagnostic tools, certified mechanics, precision you can trust.</p>
            <div className="hero-actions">
              <a href="#booking" className="btn btn-red"><i className="fas fa-calendar-check"></i> Book Appointment</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: 'Hello, I need car assistance' }); }} className="btn btn-outline"><i className="fab fa-whatsapp"></i> WhatsApp Us</a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hstat-num"><span className="cnt">{counters.years}</span><sup>+</sup></div>
                <div className="hstat-label">Years Experience</div>
              </div>
              <div>
                <div className="hstat-num"><span className="cnt">{counters.cars}</span><sup>+</sup></div>
                <div className="hstat-label">Cars Serviced</div>
              </div>
              <div>
                <div className="hstat-num"><span className="cnt">{counters.emergency}</span><sup>/7</sup></div>
                <div className="hstat-label">Emergency Service</div>
              </div>
              <div>
                <div className="hstat-num"><span className="cnt">{counters.satisfaction}</span><sup>%</sup></div>
                <div className="hstat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-track" id="marqueeTrack">
          {allMarqueeItems.map((name, i) => (
            <span key={i} className="marquee-item">
              {name}
              <span className="marquee-sep"></span>
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="sec">
        <div className="inner">
          <div className="rv">
            <div className="sec-tag">What we do</div>
            <h2 className="sec-h">Our <span className="red">Services</span></h2>
            <div className="bar"></div>
          </div>
          <div className="svc-grid rv rv1" id="svcGrid">
            {SERVICES.map((s, i) => (
              <div 
                key={i} 
                className={`svc-card ${highlightedService === s.name ? 'highlight-pulse' : ''}`} 
                onClick={() => setSelectedService(s)} 
                style={{ cursor: 'pointer' }}
              >
                <div className="svc-content">
                  <div className="svc-n">{String(i + 1).padStart(2, '0')}</div>
                  <div className="svc-ico"><i className={s.icon}></i></div>
                  <div className="svc-name">{s.name}</div>
                  <div className="svc-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section id="emergency" className="sec">
        <div className="inner">
          <div className="rv">
            <div className="sec-tag">24 / 7 Assistance</div>
            <h2 className="sec-h">Need Urgent <span className="red">Help?</span></h2>
            <div className="bar"></div>
          </div>
          <div className="emg-grid rv rv1">
            <div className="emg-card">
              <div className="emg-ico"><i className="fas fa-truck-fast"></i></div>
              <h3>Emergency Home Repairs</h3>
              <p>Car won't start? Flat tire? Engine trouble? Our mobile mechanics are ready 24/7 — home, office, or roadside.</p>
              <ul className="emg-list">
                <li><i className="fas fa-check"></i> 30-minute response time</li>
                <li><i className="fas fa-check"></i> Free on-site diagnostic</li>
                <li><i className="fas fa-check"></i> No hidden fees</li>
              </ul>
            </div>
            <div className="emg-card lite">
              <div className="emg-ico" style={{ background: 'rgba(42,82,190,.08)', borderColor: 'rgba(42,82,190,.15)' }}>
                <i className="fas fa-phone-alt" style={{ color: 'var(--accent)' }}></i>
              </div>
              <h3 style={{ color: 'var(--text)' }}>Emergency Hotline</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Available 24 hours a day, 7 days a week</p>
              <div style={{ margin: '12px 0 22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a href="tel:+237657797736" className="emg-phone" style={{ margin: 0 }}>+237 6 57 79 77 36</a>
                <a href="tel:+237671116107" className="emg-phone" style={{ margin: 0 }}>+237 6 71 11 61 07</a>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: 'URGENT: I need immediate car assistance' }); }} className="btn btn-red" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="fab fa-whatsapp"></i> Request Emergency Service
              </a>
              <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '12px', textAlign: 'center' }}>We'll arrive within 30–60 minutes</p>
            </div>
          </div>
          <div className="emg-pills rv">
            <div className="emg-pill"><i className="fas fa-car-side"></i><span>Flat Tire</span></div>
            <div className="emg-pill"><i className="fas fa-battery-full"></i><span>Battery Jump</span></div>
            <div className="emg-pill"><i className="fas fa-gas-pump"></i><span>Fuel Delivery</span></div>
            <div className="emg-pill"><i className="fas fa-tools"></i><span>Engine Repair</span></div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="sec">
        <div className="inner">
          <div className="rv head-c">
            <div className="sec-tag" style={{ justifyContent: 'center' }}>Schedule a visit</div>
            <h2 className="sec-h">Book an <span className="red">Appointment</span></h2>
            <div className="bar" style={{ margin: '14px auto 0' }}></div>
          </div>
          <div className="bk-wrap">
            <div className="bk-info rv">
              <h3>Simple,<br />Fast Booking</h3>
              <p>Fill out the form and we'll confirm your appointment via WhatsApp within minutes. No waiting, no hassle.</p>
              <ul className="bk-steps">
                <li>
                  <div className="step-n">01</div>
                  <div className="step-t"><strong>Fill in the form</strong><span>Your name, vehicle & service needed</span></div>
                </li>
                <li>
                  <div className="step-n">02</div>
                  <div className="step-t"><strong>Choose date & time</strong><span>Mon–Sat, 8:00 AM – 7:00 PM</span></div>
                </li>
                <li>
                  <div className="step-n">03</div>
                  <div className="step-t"><strong>WhatsApp confirmation</strong><span>We confirm your booking in minutes</span></div>
                </li>
                <li>
                  <div className="step-n">04</div>
                  <div className="step-t"><strong>Bring your vehicle</strong><span>Ancient Route Santa Lucia, Bonaberi</span></div>
                </li>
              </ul>
            </div>
            <div className="rv rv2">
              <form className="bk-card" id="bkForm" onSubmit={handleBookingSubmit}>
                <div className="fg">
                  <label>Full Name</label>
                  <input type="text" name="name" id="bkName" className="fi" placeholder="e.g. Jean-Pierre Mbarga" required />
                </div>
                <div className="fg">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" id="bkPhone" className="fi" placeholder="+237 6XX XXX XXX" required />
                </div>
                <div className="fg">
                  <label>Car Model</label>
                  <input type="text" name="car" id="bkCar" className="fi" placeholder="e.g. Toyota Corolla 2018" required />
                </div>
                <div className="fg">
                  <label>Service Needed</label>
                  <select name="service" id="bkSvc" className="fi" required defaultValue="">
                    <option value="" disabled>Select a service…</option>
                    {SERVICES.map((s, i) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="fg-row fg">
                  <div>
                    <label>Preferred Date</label>
                    <input type="date" name="date" id="bkDate" className="fi" required />
                  </div>
                  <div>
                    <label>Preferred Time</label>
                    <input type="time" name="time" id="bkTime" className="fi" required />
                  </div>
                </div>
                <div className="fg">
                  <label>Message (optional)</label>
                  <textarea name="message" id="bkMsg" className="fi" rows={3} placeholder="Any additional details…" style={{ resize: 'none' }}></textarea>
                </div>
                <button type="submit" className="btn btn-red" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fab fa-whatsapp"></i> Book via WhatsApp
                </button>
                {bookingConf && (
                  <div id="bkConf" style={{ display: 'block' }}>{bookingConf}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="sec">
        <div className="inner">
          <div className="ab-grid">
            <div className="ab-img-wrap rv">
              <img src="https://i.ibb.co/KxCmNYnG/about-shop.jpg" alt="D.E.N Auto Care Workshop" loading="lazy" />
              <div className="ab-badge"><strong>7+</strong><span>Years</span></div>
            </div>
            <div className="rv rv1">
              <div className="sec-tag">Our story</div>
              <h2 className="sec-h">About <span className="red">D.E.N Auto Care</span></h2>
              <div className="bar"></div>
              <p className="ab-p">D.E.N Auto Care is a professional automotive service garage located in Douala Bonaberi, Ancient Route Santa Lucia — specializing in vehicle diagnostics, mechanical repairs and maintenance.</p>
              <p className="ab-p" style={{ marginTop: '12px' }}>Our team uses modern diagnostic equipment to quickly identify vehicle issues and provide reliable repairs. Trust, transparency, and quality work are at the core of everything we do.</p>
              <div className="ab-tags">
                <span className="ab-tag"><i className="fas fa-check"></i> Certified mechanics</span>
                <span className="ab-tag"><i className="fas fa-check"></i> 7+ years experience</span>
                <span className="ab-tag"><i className="fas fa-check"></i> Free multi-point check</span>
                <span className="ab-tag"><i className="fas fa-check"></i> Modern diagnostic tools</span>
              </div>
              <div className="ab-info">
                <div className="ab-row"><i className="fas fa-map-pin"></i> Douala Bonaberi, Ancient Route Santa Lucia</div>
                <div className="ab-row"><i className="fas fa-phone-alt"></i> +237 692 736 822 / +237 671 116 107</div>
                <div className="ab-row"><i className="fas fa-clock"></i> Monday – Saturday: 8:00 AM – 7:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="sec" style={{ background: 'var(--bg2)' }}>
        <div className="inner">
          <div className="rv head-c">
            <div className="sec-tag" style={{ justifyContent: 'center' }}>Auto Parts & Fluids</div>
            <h2 className="sec-h">Our <span className="red">Shop</span></h2>
            <div className="bar" style={{ margin: '14px auto 0' }}></div>
          </div>
          <div className="shop-grid rv">
            {products.slice(0, 8).map((p, i) => (
              <div key={i} className="shop-card">
                <div className="shop-img-wrap">
                  <div className="shop-badge">In Stock</div>
                  <img src={p.image} alt={p.name} className="shop-img" loading="lazy" />
                </div>
                <div className="shop-content">
                  <span className="shop-cat">{p.desc.split('(')[0].trim()}</span>
                  <h4 className="shop-name">{p.name}</h4>
                  <p className="shop-desc">{p.desc}</p>
                  <div className="shop-bot">
                    <span className="shop-price">{p.price}</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: `I'm interested in buying ${p.name}` }); }} className="btn-buy">
                      <i className="fab fa-whatsapp"></i> Buy
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rv" style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn btn-outline" style={{ display: 'inline-flex' }} onClick={() => { setView('shop'); window.scrollTo(0, 0); }}>View All Products</button>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="sec" style={{ background: 'var(--bg2)' }}>
        <div className="inner">
          <div className="rv head-c">
            <div className="sec-tag" style={{ justifyContent: 'center' }}>Find us</div>
            <h2 className="sec-h">Our <span className="red">Location</span></h2>
            <div className="bar" style={{ margin: '14px auto 0' }}></div>
          </div>
          <div className="loc-card rv">
            <div className="loc-top">
              <h3>D.E.N Auto Care Bonaberi</h3>
              <p>Ancient Route Santa Lucia, Douala</p>
              <div className="loc-float"><i className="fas fa-map-marker-alt"></i></div>
            </div>
            <div className="loc-body">
              <div className="loc-row"><i className="fas fa-clock"></i> Monday – Saturday: 8:00 AM – 7:00 PM</div>
              <div className="loc-row"><i className="fas fa-phone-alt"></i> +237 692 736 822 / +237 671 116 107</div>
              <div style={{ marginTop: '28px' }}>
                <a href="https://www.google.com/maps/dir/?api=1&destination=Santa+Lucia+Bonaberi+Douala+Cameroun" target="_blank" rel="noreferrer" className="btn btn-red" style={{ display: 'inline-flex' }}>
                  <i className="fas fa-directions"></i> Get Directions on Google Maps
                </a>
                <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '10px' }}>Opens Google Maps with navigation to Santa Lucia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="sec">
        <div className="inner">
          <div className="rv head-c">
            <div className="sec-tag" style={{ justifyContent: 'center' }}>Get in touch</div>
            <h2 className="sec-h">Contact <span className="red">Info</span></h2>
            <div className="bar" style={{ margin: '14px auto 0' }}></div>
          </div>
          <div className="ct-grid">
            <div className="ct-card rv">
              <div className="ct-ico"><i className="fas fa-phone-alt"></i></div>
              <h4>Call Us</h4>
              <p>+237 692 736 822<br/>+237 671 116 107</p>
              <small>24/7 support available</small>
            </div>
            <div className="ct-card rv rv1">
              <div className="ct-ico"><i className="fas fa-map-marker-alt"></i></div>
              <h4>Visit Us</h4>
              <p>Douala Bonaberi<br />Ancient Route Santa Lucia</p>
            </div>
            <div className="ct-card rv rv2">
              <div className="ct-ico"><i className="fas fa-clock"></i></div>
              <h4>Open Hours</h4>
              <p>Monday – Saturday<br /><strong style={{ color: 'var(--accent)' }}>8:00 AM – 7:00 PM</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <div className="ft-wrap">
          <div className="ft-grid">
            <div>
              <div className="ft-name">D.E.N <span>AUTO CARE</span></div>
              <p className="ft-tag">Professional diagnostic & mechanical repair in the heart of Bonaberi, Douala. Quality work you can trust.</p>
              <div className="ft-social">
                <a href="#" className="ft-soc" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="ft-soc" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: 'Hello!' }); }} className="ft-soc" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            <div className="ft-col">
              <h5>Quick Links</h5>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#emergency">Emergency</a></li>
                <li><a href="#booking">Booking</a></li>
              </ul>
            </div>
            <div className="ft-col">
              <h5>Services</h5>
              <ul id="ftSvc">
                {SERVICES.slice(0, 5).map((s, i) => (
                  <li key={i}>
                    <a href="#services" onClick={(e) => {
                      e.preventDefault();
                      setHighlightedService(null); // Clear any existing highlight immediately
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                      // Add a delay to allow the smooth scroll to finish before animating
                      setTimeout(() => {
                        setHighlightedService(s.name);
                        setTimeout(() => setHighlightedService(null), 2500); // 2.5s to cover the 2x 1s animation
                      }, 800); 
                    }}>
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ft-col">
              <h5>Contact</h5>
              <ul className="ft-contact-list">
                <li><i className="fas fa-phone"></i> <div>+237 692 736 822<br/>+237 671 116 107</div></li>
                <li><i className="fas fa-map-pin"></i> Bonaberi, Douala, Cameroon</li>
              </ul>
            </div>
          </div>
          <div className="ft-bottom">
            <p>&copy; 2026 D.E.N Auto Care – Diagnostic Automobile. All rights reserved.</p>
            <p>Douala Bonaberi, Cameroon</p>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* Service Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedService(null)}><i className="fas fa-times"></i></button>
            <div className="modal-body">
              <div className="modal-ico"><i className={selectedService.icon}></i></div>
              <h3>{selectedService.name}</h3>
              <p className="modal-desc">{selectedService.desc}</p>
              <div className="modal-details">
                <h4>Service Details & Requirements</h4>
                <p>{selectedService.details}</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); setWaModalData({ text: `I'd like to book the ${selectedService.name} service` }); }} className="btn btn-red" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                Book This Service
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Choose Number Modal */}
      {waModalData && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setWaModalData(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', textAlign: 'center' }}>
            <button className="modal-close" onClick={() => setWaModalData(null)}><i className="fas fa-times"></i></button>
            <div className="modal-body" style={{ padding: '30px 20px' }}>
              <div className="modal-ico" style={{ margin: '0 auto 16px', background: 'rgba(37,211,102,0.1)', color: '#25D366', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}><i className="fab fa-whatsapp"></i></div>
              <h3>Contact Us</h3>
              <p className="modal-desc" style={{ marginBottom: '24px' }}>Choose a WhatsApp number to continue:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'center', background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => openWhatsApp('237657797736', waModalData.text)}>
                  <i className="fab fa-whatsapp"></i> +237 6 57 79 77 36
                </button>
                <button className="btn" style={{ width: '100%', justifyContent: 'center', background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => openWhatsApp('237671116107', waModalData.text)}>
                  <i className="fab fa-whatsapp"></i> +237 6 71 11 61 07
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Popup */}
      {isMaintenance && (
        <div className="maintenance-overlay">
          <div className="maintenance-content">
            <div className="maintenance-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h2>Under Maintenance</h2>
            <p>We are currently performing scheduled maintenance to improve our services. Our website will be available again soon. Thank you for your patience!</p>
          </div>
        </div>
      )}
    </>
  );
}
