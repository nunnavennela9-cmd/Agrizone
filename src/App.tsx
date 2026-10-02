import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import {
  MapPin, ChevronDown, Tractor, Users, Building2, TrendingUp,
  Package, MessageSquare, X, Check, AlertTriangle, ThumbsUp,
  Phone, Star, LogOut, User as UserIcon,
  Droplets, Sun, Send, Loader2, Eye, EyeOff,
  Shield, Sprout, Trash2, PlusCircle, Globe
} from 'lucide-react';
import { supabase, Profile, EquipmentListing, LaborListing, InfrastructureListing, CropListing, AgroProduct, Grievance, State, District, Mandal } from './lib/supabase';

/* ═══════════════════════════════════════════════════════════
   LANGUAGE SYSTEM
   ═══════════════════════════════════════════════════════════ */
type Language = 'en' | 'te' | 'hi';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

const T: Record<Language, Record<string, string>> = {
  en: {
    appName: 'AgriZone', tagline: 'Mandal-Level Agricultural Marketplace', signIn: 'Sign In', signUp: 'Sign Up',
    fullName: 'Full Name', email: 'Email', password: 'Password', state: 'State', district: 'District',
    mandal: 'Mandal (Zone)', village: 'Village', farmer: 'Farmer', laborer: 'Laborer', dealer: 'Dealer',
    owner: 'Equipment Owner', equipment: 'Equipment', labor: 'Labor', infra: 'Infrastructure', market: 'Market',
    inputs: 'Agro Inputs', grievance: 'Grievance', addListing: 'Add Listing', myListings: 'My Listings',
    available: 'Available', notAvailable: 'Not Available', pricePerHour: 'Price/Hour', pricePerDay: 'Price/Day',
    contactToBook: 'Contact to Book', contactFarmer: 'Contact Farmer', contactLaborer: 'Contact Laborer',
    callNow: 'Call Now', selectState: 'Select State', selectDistrict: 'Select District', selectMandal: 'Select Mandal (Zone)',
    selectVillage: 'Select Village', skills: 'Skills', saveEquipment: 'Save Equipment', saveProfile: 'Save Profile',
    listCropForSale: 'List Crop for Sale', addProduct: 'Add Product', submitGrievance: 'Submit Grievance',
    specifications: 'Specifications', selectZone: 'Select Zone', changeZone: 'Change Zone', currentZone: 'Current Zone',
    noDataFound: 'No listings in this mandal', beFirst: 'Be the first to add!', bookingSent: 'Booking request sent!',
    enterPhone: 'Your Phone', enterMessage: 'Message', sendRequest: 'Send Request', iAmA: 'I am a', createAccount: 'Create Account',
    pleaseWait: 'Please wait...', noZoneSelected: 'Select a Zone to View Listings', zoneRequired: 'Please select your zone', selectCrop: 'Select Crop',
  },
  te: {
    appName: 'అగ్రిజోన్', tagline: 'మండల స్థాయి వ్యవసాయ మార్కెట్', signIn: 'సైన్ ఇన్', signUp: 'సైన్ అప్',
    fullName: 'పూర్తి పేరు', email: 'ఇమెయిల్', password: 'పాస్‌వర్డ్', state: 'రాష్ట్రం', district: 'జిల్లా',
    mandal: 'మండలం (జోన్)', village: 'గ్రామం', farmer: 'రైతు', laborer: 'కూలీ', dealer: 'డీలర్',
    owner: 'పరికరాల యజమాని', equipment: 'పరికరాలు', labor: 'కూలీలు', infra: 'మౌలిక సదుపాయాలు', market: 'మార్కెట్',
    inputs: 'వ్యవసాయ సామగ్రి', grievance: 'ఫిర్యాదులు', addListing: 'జోడించు', myListings: 'నా జాబితా',
    available: 'అందుబాటులో', notAvailable: 'అందుబాటులో లేదు', contactToBook: 'సంప్రదించండి', callNow: 'కాల్ చేయండి',
    selectState: 'రాష్ట్రం ఎంచుకోండి', selectDistrict: 'జిల్లా ఎంచుకోండి', selectMandal: 'మండలం ఎంచుకోండి',
    selectZone: 'జోన్ ఎంచుకోండి', changeZone: 'జోన్ మార్చు', currentZone: 'ప్రస్తుత జోన్',
    noDataFound: 'ఈ మండలంలో జాబితా లేదు', beFirst: 'మొదటి జాబితా చేర్చండి!', noZoneSelected: 'జాబితాలు చూడటానికి జోన్ ఎంచుకోండి',
    zoneRequired: 'దయచేసి మీ జోన్ ఎంచుకోండి',
  },
  hi: {
    appName: 'एग्रीज़ोन', tagline: 'मंडल-स्तरीय कृषि बाज़ार', signIn: 'साइन इन', signUp: 'साइन अप',
    fullName: 'पूरा नाम', email: 'ईमेल', password: 'पासवर्ड', state: 'राज्य', district: 'जिला',
    mandal: 'मंडल (ज़ोन)', village: 'गांव', farmer: 'किसान', laborer: 'मजदूर', dealer: 'डीलर',
    owner: 'उपकरण मालिक', equipment: 'उपकरण', labor: 'मजदूर', infra: 'बुनियादी ढांचा', market: 'बाज़ार',
    inputs: 'कृषि सामग्री', grievance: 'शिकायत', addListing: 'जोड़ें', myListings: 'मेरी सूची',
    available: 'उपलब्ध', notAvailable: 'उपलब्ध नहीं', contactToBook: 'संपर्क करें', callNow: 'कॉल करें',
    selectState: 'राज्य चुनें', selectDistrict: 'जिला चुनें', selectMandal: 'मंडल चुनें',
    selectZone: 'ज़ोन चुनें', changeZone: 'ज़ोन बदलें', currentZone: 'वर्तमान ज़ोन',
    noDataFound: 'इस मंडल में कोई लिस्टिंग नहीं', beFirst: 'पहली लिस्टिंग जोड़ें!', noZoneSelected: 'लिस्टिंग देखने के लिए ज़ोन चुनें',
    zoneRequired: 'कृपया अपना ज़ोन चुनें',
  },
};

const LanguageContext = createContext<{ lang: Language; t: (k: string) => string; setLang: (l: Language) => void } | null>(null);
const useLang = () => { const c = useContext(LanguageContext); if (!c) throw new Error('useLang'); return c; };

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('agz-lang') as Language) || 'en');
  const setL = (l: Language) => { setLang(l); localStorage.setItem('agz-lang', l); };
  const t = (k: string) => T[lang][k] || T['en'][k] || k;
  return <LanguageContext.Provider value={{ lang, t, setLang: setL }}>{children}</LanguageContext.Provider>;
}

function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-white">
        <Globe className="w-4 h-4 text-amber-400" />{LANGUAGES.find(l => l.code === lang)?.native}<ChevronDown className="w-3 h-3" />
      </button>
      {open && <><div className="fixed inset-0 z-40" onClick={() => setOpen(false)} /><div className="absolute right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 min-w-[120px]">{LANGUAGES.map(l => <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} className={`w-full px-3 py-2 text-left text-sm ${l.code === lang ? 'bg-emerald-900/50 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{l.native}</button>)}</div></>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AUTH CONTEXT
   ═══════════════════════════════════════════════════════════ */
const AuthContext = createContext<{ user: User | null; profile: Profile | null; loading: boolean; signUp: (e: string, p: string, n: string, data: { stateId: number; districtId: number; mandalId: number; userType: string }) => Promise<{ error: Error | null }>; signIn: (e: string, p: string) => Promise<{ error: Error | null }>; signOut: () => Promise<void>; refreshProfile: () => Promise<void> } | null>(null);
const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth'); return c; };

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle().then(({ data }) => setProfile(data));
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle().then(({ data }) => setProfile(data));
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, data: { stateId: number; districtId: number; mandalId: number; userType: string }) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: new Error(error.message) };
    const { data: { user: newUser } } = await supabase.auth.getUser();
    if (newUser) {
      const { error: pe } = await supabase.from('profiles').insert({ id: newUser.id, full_name: fullName, zone_id: `mandal_${data.mandalId}`, user_type: data.userType, state_id: data.stateId, district_id: data.districtId, mandal_id: data.mandalId });
      if (pe) return { error: new Error(pe.message) };
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => { await supabase.auth.signOut(); };
  const refreshProfile = async () => { if (user) { const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(); if (data) setProfile(data); } };

  return <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>{children}</AuthContext.Provider>;
}

/* ═══════════════════════════════════════════════════════════
   ZONE SELECTOR COMPONENT
   ═══════════════════════════════════════════════════════════ */
function ZoneSelector({ value, onChange, showLabel = true }: { value: { stateId: number | null; districtId: number | null; mandalId: number | null }; onChange: (v: typeof value) => void; showLabel?: boolean }) {
  const { t } = useLang();
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [mandals, setMandals] = useState<Mandal[]>([]);

  useEffect(() => { supabase.from('states').select('*').order('name').then(({ data }) => setStates(data || [])); }, []);

  useEffect(() => {
    if (value.stateId) {
      supabase.from('districts').select('*').eq('state_id', value.stateId).order('name').then(({ data }) => { setDistricts(data || []); setMandals([]); });
    } else { setDistricts([]); setMandals([]); }
    onChange({ ...value, districtId: null, mandalId: null });
  }, [value.stateId]);

  useEffect(() => {
    if (value.districtId) {
      supabase.from('mandals').select('*').eq('district_id', value.districtId).order('name').then(({ data }) => setMandals(data || []));
    } else setMandals([]);
    onChange({ ...value, mandalId: null });
  }, [value.districtId]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        {showLabel && <label className="block text-xs font-semibold text-slate-400 mb-1">{t('state')}</label>}
        <select value={value.stateId || ''} onChange={e => onChange({ ...value, stateId: e.target.value ? parseInt(e.target.value) : null })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
          <option value="">{t('selectState')}</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        {showLabel && <label className="block text-xs font-semibold text-slate-400 mb-1">{t('district')}</label>}
        <select value={value.districtId || ''} onChange={e => onChange({ ...value, districtId: e.target.value ? parseInt(e.target.value) : null })} disabled={!value.stateId} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50">
          <option value="">{t('selectDistrict')}</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div>
        {showLabel && <label className="block text-xs font-semibold text-slate-400 mb-1">{t('mandal')}</label>}
        <select value={value.mandalId || ''} onChange={e => onChange({ ...value, mandalId: e.target.value ? parseInt(e.target.value) : null })} disabled={!value.districtId} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50">
          <option value="">{t('selectMandal')}</option>
          {mandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════ */
interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

function Toasts({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return <div className="fixed top-3 right-3 z-[9999] flex flex-col gap-2 max-w-xs">{toasts.map(t => (
    <div key={t.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm ${t.type === 'success' ? 'bg-emerald-900 text-emerald-100' : t.type === 'error' ? 'bg-red-900 text-red-100' : 'bg-amber-900 text-amber-100'}`}>
      {t.type === 'success' ? <Check className="w-4 h-4" /> : t.type === 'error' ? <X className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      <span className="flex-1">{t.message}</span>
      <button onClick={() => dismiss(t.id)}><X className="w-3 h-3" /></button>
    </div>
  ))}</div>;
}

function Modal({ open, close, title, children }: { open: boolean; close: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={close} className="p-1 hover:bg-slate-800 rounded text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  const colors: Record<string, string> = { green: 'bg-emerald-500/20 text-emerald-300', red: 'bg-red-500/20 text-red-300', amber: 'bg-amber-500/20 text-amber-300', blue: 'bg-blue-500/20 text-blue-300' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.green}`}>{text}</span>;
}

function LocationLine({ item }: { item: { states?: State; districts?: District; mandals?: Mandal } }) {
  const parts: string[] = [];
  if (item.mandals?.name) parts.push(item.mandals.name);
  if (item.districts?.name) parts.push(item.districts.name);
  if (item.states?.name) parts.push(item.states.name);
  return parts.length > 0 ? <div className="flex items-center gap-1 text-xs text-slate-400 mt-1"><MapPin className="w-3 h-3" />{parts.join(' → ')}</div> : null;
}

function ContactModal({ open, close, item }: { open: boolean; close: () => void; item: EquipmentListing | LaborListing | CropListing | null }) {
  const { t } = useLang();
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  if (!item) return null;

  const ownerPhone = (item as any).contact_phone || item.profiles?.phone || 'Not provided';
  const getName = () => 'name' in item ? item.name : 'crop_name' in item ? item.crop_name : '';
  const getPrice = () => 'price_per_hour' in item ? `Rs.${item.price_per_hour}/hr` : 'rate_per_day' in item ? `Rs.${item.rate_per_day}/day` : 'price_per_quintal' in item ? `Rs.${item.price_per_quintal}/qtl` : '';

  return (
    <Modal open={open} close={close} title={t('contactToBook')}>
      <div className="space-y-3">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div><h4 className="font-bold text-white">{getName()}</h4><LocationLine item={item} /></div>
            <span className="text-lg font-black text-amber-400">{getPrice()}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700 text-sm text-slate-300">
            <span className="font-medium">{item.profiles?.full_name}</span> • <span className="text-emerald-400">{ownerPhone}</span>
            {ownerPhone !== 'Not provided' && <a href={`tel:${ownerPhone}`} className="ml-2 px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded"><Phone className="w-3 h-3 inline mr-1" />{t('callNow')}</a>}
          </div>
        </div>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('enterPhone')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={t('enterMessage')} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
        <button onClick={() => { close(); }} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm">{t('sendRequest')}</button>
      </div>
    </Modal>
  );
}

const EQUIPMENT = ['Rotavator', 'Cultivator', 'Plough', 'Harvester', 'Seed Drill', 'Power Tiller', 'Sprayer', 'Thresher', 'Trailer'];
const CROPS = ['Paddy', 'Wheat', 'Cotton', 'Maize', 'Groundnut', 'Chilli', 'Onion', 'Sugarcane', 'Turmeric', 'Bengal Gram'];
const SKILLS = ['Ploughing', 'Sowing', 'Harvesting', 'Weeding', 'Spraying', 'Irrigation', 'Tractor Driving', 'Land Leveling'];
const AGRO_TYPES = ['Select Product','Fertilizer', 'Pesticide', 'Fungicide', 'Herbicide', 'Seed', 'Micronutrient'];
const GRV_CATS = ['Select Problem', 'Irrigation', 'Roads', 'Electricity', 'Supply', 'Pest', 'Market', 'Other'];

function Empty({ msg }: { msg?: string }) {
  const { t } = useLang();
  return <div className="flex flex-col items-center justify-center py-16 text-center"><Package className="w-10 h-10 text-slate-700 mb-2" /><p className="text-slate-500">{msg || t('noDataFound')}</p><p className="text-xs text-slate-600 mt-1">{t('beFirst')}</p></div>;
}

/* ═══════════════════════════════════════════════════════════
   AUTH SCREEN
   ═══════════════════════════════════════════════════════════ */
function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useLang();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('farmer');
  const [zone, setZone] = useState({ stateId: null as number | null, districtId: null as number | null, mandalId: null as number | null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signIn } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message); else onSuccess();
    } else {
      if (!zone.stateId || !zone.districtId || !zone.mandalId) { setError(t('zoneRequired')); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName, {
        stateId: zone.stateId!,
        districtId: zone.districtId!,
        mandalId: zone.mandalId!,
        userType
      }); if (error) setError(error.message); else onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center mx-auto mb-3"><Sprout className="w-8 h-8 text-emerald-900" /></div>
          <h1 className="text-2xl font-black text-white">{t('appName')}</h1>
          <p className="text-xs text-slate-400">{t('tagline')}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-1 rounded-lg overflow-hidden">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold ${isLogin ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{t('signIn')}</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold ${!isLogin ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{t('signUp')}</button>
            </div>
            <LanguageSelector />
          </div>
          <form onSubmit={submit} className="space-y-3">
            {!isLogin && (
              <>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder={t('fullName')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                <ZoneSelector value={zone} onChange={setZone} />
                <select value={userType} onChange={e => setUserType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="farmer">{t('farmer')}</option>
                  <option value="laborer">{t('laborer')}</option>
                  <option value="dealer">{t('dealer')}</option>
                  <option value="owner">{t('owner')}</option>
                </select>
              </>
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={t('email')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder={t('password')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {error && <div className="bg-red-900/30 text-red-300 text-xs px-3 py-2 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? t('pleaseWait') : isLogin ? t('signIn') : t('createAccount')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LISTING FORMS
   ═══════════════════════════════════════════════════════════ */
function EqForm({ zone, onSave }: { zone: { stateId: number; districtId: number; mandalId: number }; onSave: (d: Partial<EquipmentListing>) => void }) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [specs, setSpecs] = useState('');
  
  // Fixed state
  const [price, setPrice] = useState<number | ''>('');
  
  const [phone, setPhone] = useState('');
  const [avail, setAvail] = useState(true);
  
  return (
    <div className="space-y-3">
      <select value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
        <option value="">Select Equipment</option>
        {EQUIPMENT.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
      <input value={specs} onChange={e => setSpecs(e.target.value)} placeholder={t('specifications')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      <div className="grid grid-cols-2 gap-2">
        {/* Fixed onChange */}
        <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder={t('pricePerHour')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      </div>
      <button onClick={() => setAvail(!avail)} className="flex items-center gap-2 text-sm"><span className={`w-10 h-5 rounded-full ${avail ? 'bg-emerald-600' : 'bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition ${avail ? 'translate-x-5' : 'translate-x-0.5'}`} /></span>{avail ? t('available') : t('notAvailable')}</button>
      
      <button 
  onClick={() => onSave({ 
    zone_id: zone.mandalId?.toString(),
    name, 
    specs, 
    price_per_hour: Number(price) || 0,
    contact_phone: phone,
    state_id: zone.stateId, 
    district_id: zone.districtId, 
    mandal_id: zone.mandalId 
  })} 
  disabled={!name} 
  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm"
>
  {t('saveEquipment')}
</button>
    </div>
  )
}

function LabForm({ zone, onSave }: { zone: { stateId: number; districtId: number; mandalId: number }; onSave: (d: Partial<LaborListing>) => void }) {
  const { t } = useLang();
  const [skills, setSkills] = useState<string[]>([]);
  
  // Fixed state
  const [rate, setRate] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  
  const [avail, setAvail] = useState(true);
  const toggle = (s: string) => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {/* Fixed onChange */}
        <input type="number" value={age} onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder="Age" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
        <input type="number" value={rate} onChange={e => setRate(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder={t('pricePerDay')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      </div>
      <div className="flex flex-wrap gap-1">{SKILLS.map(s => <button key={s} type="button" onClick={() => toggle(s)} className={`px-2 py-1 rounded text-xs font-medium ${skills.includes(s) ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{s}</button>)}</div>
      <button onClick={() => setAvail(!avail)} className="flex items-center gap-2 text-sm"><span className={`w-10 h-5 rounded-full ${avail ? 'bg-emerald-600' : 'bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition ${avail ? 'translate-x-5' : 'translate-x-0.5'}`} /></span>{avail ? t('available') : t('notAvailable')}</button>
      
      {/* Handled numbers in payload */}
      <button onClick={() => onSave({ zone_id: zone.mandalId?.toString(), skills, rate_per_day: Number(rate) || 0, age: age === '' ? null : Number(age), available: avail, state_id: zone.stateId, district_id: zone.districtId, mandal_id: zone.mandalId })} disabled={skills.length === 0} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm">{t('saveProfile')}</button>
    </div>
  );
}

function InfraForm({ zone, onSave }: { zone: { stateId: number; districtId: number; mandalId: number }; onSave: (d: Partial<InfrastructureListing>) => void }) {
  const { t } = useLang();
  const [type, setType] = useState<'drying_yard' | 'tubewell'>('drying_yard');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  
  // Fixed state
  const [cap, setCap] = useState<number | ''>('');
  
  const [price, setPrice] = useState('');
  const [avail, setAvail] = useState(true);
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setType('drying_yard')} className={`py-2 rounded-lg text-sm font-medium ${type === 'drying_yard' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Drying Yard</button>
        <button onClick={() => setType('tubewell')} className={`py-2 rounded-lg text-sm font-medium ${type === 'tubewell' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Borewell</button>
      </div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      <input value={village} onChange={e => setVillage(e.target.value)} placeholder={t('village')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      <div className="grid grid-cols-2 gap-2">
        {/* Fixed onChange */}
        <input type="number" value={cap} onChange={e => setCap(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder={t('specifications')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price info" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      </div>
      <button onClick={() => setAvail(!avail)} className="flex items-center gap-2 text-sm"><span className={`w-10 h-5 rounded-full ${avail ? 'bg-emerald-600' : 'bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition ${avail ? 'translate-x-5' : 'translate-x-0.5'}`} /></span>{avail ? t('available') : t('notAvailable')}</button>
      
      {/* Handled numbers in payload */}
      <button onClick={() => onSave({ zone_id: zone.mandalId?.toString(), infra_type: type, name, village, capacity: Number(cap) || 0, current_usage: 0, unit: type === 'drying_yard' ? 'sq ft' : 'lph', price_info: price, available: avail, state_id: zone.stateId, district_id: zone.districtId, mandal_id: zone.mandalId })} disabled={!name || !village} className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm">Save</button>
    </div>
  );
}

function CropForm({ zone, onSave }: { zone: { stateId: number; districtId: number; mandalId: number }; onSave: (d: Partial<CropListing>) => void }) {
  const { t } = useLang();
  const [name, setName] = useState('');
  
  const [qty, setQty] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  
  const [village, setVillage] = useState('');

  return (
    <div className="space-y-3">
      <select value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
        <option value="">{t('selectCrop')}</option>
        {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      
      <input value={village} onChange={e => setVillage(e.target.value)} placeholder={t('village')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      
      <div className="grid grid-cols-2 gap-2">
        <input 
          type="number" 
          value={qty} 
          onChange={e => setQty(e.target.value === '' ? '' : parseInt(e.target.value))} 
          placeholder="Quantity" 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" 
        />
        <input 
          type="number" 
          value={price} 
          onChange={e => setPrice(e.target.value === '' ? '' : parseInt(e.target.value))} 
          placeholder={t('pricePerQuintal')} 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" 
        />
      </div>
      
      <button 
        onClick={() => onSave({ 
          zone_id: zone.mandalId?.toString(), 
          crop_name: name, 
          quantity: Number(qty) || 0, 
          price_per_quintal: Number(price) || 0, 
          village, 
          state_id: zone.stateId, 
          district_id: zone.districtId, 
          mandal_id: zone.mandalId 
        })} 
        disabled={!name || !village} 
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm"
      >
        {t('listCropForSale')}
      </button>
    </div>
  );
}

function AgroForm({ zone, onSave }: { zone: { stateId: number; districtId: number; mandalId: number }; onSave: (d: Partial<AgroProduct>) => void }) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [type, setType] = useState('Select Product');
  
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');

  return (
    <div className="space-y-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder={t('productName')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      
      <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
        {AGRO_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      
      <div className="grid grid-cols-2 gap-2">
        <input 
          type="number" 
          value={price} 
          onChange={e => setPrice(e.target.value === '' ? '' : parseInt(e.target.value))} 
          placeholder="Price" 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" 
        />
        <input 
          type="number" 
          value={stock} 
          onChange={e => setStock(e.target.value === '' ? '' : parseInt(e.target.value))} 
          placeholder={t('stock')} 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" 
        />
      </div>
      
      <button 
        onClick={() => onSave({ 
          product_name: name, 
          product_type: type, 
          price: Number(price) || 0, 
          stock: Number(stock) || 0, 
          state_id: zone.stateId, 
          district_id: zone.districtId, 
          mandal_id: zone.mandalId 
        })} 
        disabled={!name} 
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm"
      >
        {t('listAgroProduct')}
      </button>
    </div>
  );
}

function GrvForm({ zone, onSave }: { zone: { stateId: number; districtId: number; mandalId: number }; onSave: (d: Partial<Grievance>) => void }) {
  const { t } = useLang();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('select problem');
  const [village, setVillage] = useState('');
  return (
    <div className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('title')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('description')} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
      <div className="grid grid-cols-2 gap-2">
        <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">{GRV_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select>
        <input value={village} onChange={e => setVillage(e.target.value)} placeholder={t('village')} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
      </div>
      <button onClick={() => onSave({ zone_id: zone.mandalId?.toString(), title, description: desc, category: cat, village, state_id: zone.stateId, district_id: zone.districtId, mandal_id: zone.mandalId })} disabled={!title || !desc} className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2"><Send className="w-4 h-4" />{t('submitGrievance')}</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════ */
function Dashboard() {
  const { t } = useLang();
  const { user, profile, signOut } = useAuth();
  const [tabs] = useState([{ id: 'equipment', icon: Tractor, color: 'text-emerald-400' }, { id: 'labor', icon: Users, color: 'text-blue-400' }, { id: 'infrastructure', icon: Building2, color: 'text-amber-400' }, { id: 'market', icon: TrendingUp, color: 'text-green-400' }, { id: 'Fertilizer Store', icon: Package, color: 'text-purple-400' }, { id: 'grievance', icon: MessageSquare, color: 'text-orange-400' }]); const [activeTab, setActiveTab] = useState('equipment');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastRef = useRef(0);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastRef.current;
    setToasts(p => [...p, { id, message, type }]); // <-- Now the shorthand works
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  const [zoneModal, setZoneModal] = useState(false);
  const [activeZone, setActiveZone] = useState<{ stateId: number | null; districtId: number | null; mandalId: number | null; stateName?: string; districtName?: string; mandalName?: string }>({ stateId: null, districtId: null, mandalId: null });
  const [tempZone, setTempZone] = useState({ stateId: null as number | null, districtId: null as number | null, mandalId: null as number | null });
  const [listingModal, setListingModal] = useState<string | null>(null);
  const [myListingsModal, setMyListingsModal] = useState(false);
  const [contactItem, setContactItem] = useState<EquipmentListing | LaborListing | CropListing | null>(null);

  const [equipment, setEquipment] = useState<EquipmentListing[]>([]);
  const [labor, setLabor] = useState<LaborListing[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureListing[]>([]);
  const [crops, setCrops] = useState<CropListing[]>([]);
  const [agroProducts, setAgroProducts] = useState<AgroProduct[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(false);

  const [mandals, setMandals] = useState<Mandal[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    supabase.from('states').select('*').order('name').then(({ data }) => setStates(data || []));
    if (profile?.mandal_id) {
      setActiveZone({ stateId: profile.state_id, districtId: profile.district_id, mandalId: profile.mandal_id });
      if (profile.state_id) supabase.from('districts').select('*').eq('state_id', profile.state_id).then(({ data }) => setDistricts(data || []));
      if (profile.district_id) supabase.from('mandals').select('*').eq('district_id', profile.district_id).then(({ data }) => setMandals(data || []));
    }
  }, [profile]);

  useEffect(() => {
    if (tempZone.stateId) supabase.from('districts').select('*').eq('state_id', tempZone.stateId).order('name').then(({ data }) => { setDistricts(data || []); setMandals([]); });
    else { setDistricts([]); setMandals([]); }
  }, [tempZone.stateId]);

  useEffect(() => {
    if (tempZone.districtId) supabase.from('mandals').select('*').eq('district_id', tempZone.districtId).order('name').then(({ data }) => setMandals(data || []));
    else setMandals([]);
  }, [tempZone.districtId]);

  const fetchData = useCallback(async () => {
    if (!activeZone.mandalId) return;
    setLoading(true);
    const [eq, lab, infra, crop, agro, grv] = await Promise.all([
      supabase.from('equipment_listings').select('*, profiles(*), states(*), districts(*), mandals(*)').eq('mandal_id', activeZone.mandalId).eq('available', true).order('created_at', { ascending: false }),
      supabase.from('labor_listings').select('*, profiles(*), states(*), districts(*), mandals(*)').eq('mandal_id', activeZone.mandalId).eq('available', true).order('created_at', { ascending: false }),
      supabase.from('infrastructure_listings').select('*, profiles(*), states(*), districts(*), mandals(*)').eq('mandal_id', activeZone.mandalId).order('created_at', { ascending: false }),
      supabase.from('crop_listings').select('*, profiles(*), states(*), districts(*), mandals(*)').eq('mandal_id', activeZone.mandalId).eq('status', 'available').order('created_at', { ascending: false }),
      supabase.from('agro_products').select('*, profiles(*), states(*), districts(*), mandals(*)').eq('mandal_id', activeZone.mandalId).order('created_at', { ascending: false }),
      supabase.from('grievances').select('*, profiles(*), states(*), districts(*), mandals(*)').eq('mandal_id', activeZone.mandalId).order('votes', { ascending: false }),
    ]);
    setEquipment(eq.data || []);
    setLabor(lab.data || []);
    setInfrastructure(infra.data || []);
    setCrops(crop.data || []);
    setAgroProducts(agro.data || []);
    setGrievances(grv.data || []);
    setLoading(false);
  }, [activeZone.mandalId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const applyZone = () => {
    if (!tempZone.mandalId) { addToast(t('zoneRequired'), 'error'); return; }
    const st = states.find(s => s.id === tempZone.stateId);
    const dt = districts.find(d => d.id === tempZone.districtId);
    const mn = mandals.find(m => m.id === tempZone.mandalId);
    setActiveZone({ ...tempZone, stateName: st?.name, districtName: dt?.name, mandalName: mn?.name });
    setZoneModal(false);
    addToast(`Zone: ${mn?.name}, ${dt?.name}`, 'success');
  };

  const saveEquipment = async (d: Partial<EquipmentListing>) => { const { error } = await supabase.from('equipment_listings').insert({ ...d, user_id: user!.id }); if (error) addToast(error.message, 'error'); else { addToast('Equipment added!', 'success'); setListingModal(null); fetchData(); } };
  const saveLabor = async (d: Partial<LaborListing>) => { const { error } = await supabase.from('labor_listings').insert({ ...d, user_id: user!.id }); if (error) addToast(error.message, 'error'); else { addToast('Labor added!', 'success'); setListingModal(null); fetchData(); } };
  const saveInfra = async (d: Partial<InfrastructureListing>) => { const { error } = await supabase.from('infrastructure_listings').insert({ ...d, user_id: user!.id }); if (error) addToast(error.message, 'error'); else { addToast('Infrastructure added!', 'success'); setListingModal(null); fetchData(); } };
  const saveCrop = async (d: Partial<CropListing>) => { const { error } = await supabase.from('crop_listings').insert({ ...d, user_id: user!.id }); if (error) addToast(error.message, 'error'); else { addToast('Crop listed!', 'success'); setListingModal(null); fetchData(); } };
  const saveAgro = async (d: Partial<AgroProduct>) => { const { error } = await supabase.from('agro_products').insert({ ...d, user_id: user!.id }); if (error) addToast(error.message, 'error'); else { addToast('Product added!', 'success'); setListingModal(null); fetchData(); } };
  const saveGrv = async (d: Partial<Grievance>) => { const { error } = await supabase.from('grievances').insert({ ...d, user_id: user!.id }); if (error) addToast(error.message, 'error'); else { addToast('Grievance submitted!', 'success'); setListingModal(null); fetchData(); } };

  const upvote = async (id: string) => { const g = grievances.find(g => g.id === id); if (g) { await supabase.from('grievances').update({ votes: g.votes + 1 }).eq('id', id); fetchData(); } };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Toasts toasts={toasts} dismiss={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-900 border-b border-emerald-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center"><Sprout className="w-5 h-5 text-emerald-900" /></div>
            <div className="hidden sm:block"><h1 className="text-sm font-black text-white">{t('appName')}</h1><p className="text-[9px] text-emerald-300">{t('tagline')}</p></div>
          </div>

          {/* Zone Selector Button */}
          <button onClick={() => { setTempZone({ stateId: activeZone.stateId, districtId: activeZone.districtId, mandalId: activeZone.mandalId }); setZoneModal(true); }} className="flex items-center gap-2 bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-700/50 rounded-lg px-3 py-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-white truncate max-w-[180px]">{activeZone.mandalName || t('selectZone')}</p>
              <p className="text-[10px] text-emerald-300/70 truncate">{activeZone.districtName ? `${activeZone.districtName}, ${activeZone.stateName}` : t('changeZone')}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-emerald-300 shrink-0" />
          </button>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button onClick={() => setMyListingsModal(true)} className="hidden sm:flex p-1.5 bg-slate-800/60 hover:bg-slate-800 rounded-lg text-slate-300"><UserIcon className="w-4 h-4" /></button>
            <button onClick={signOut} className="p-1.5 bg-slate-800/60 hover:bg-red-900/50 rounded-lg text-slate-300 hover:text-red-300"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <nav className="hidden md:flex flex-col w-48 shrink-0 border-r border-slate-800 bg-slate-950 pt-3 px-2 gap-1 sticky top-[48px] h-[calc(100vh-48px)]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}><Icon className={`w-4 h-4 ${active ? tab.color : ''}`} /><span className="capitalize">{tab.id}</span></button>;
          })}
          <div className="mt-auto p-2">
            <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
              <div className="text-[9px] text-amber-400 font-bold uppercase">{profile?.user_type}</div>
              <div className="text-xs font-bold text-white truncate">{profile?.full_name}</div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-3 pb-20 md:pb-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-lg font-black text-white capitalize">{activeTab}</h2><p className="text-[10px] text-slate-500">{activeZone.mandalName ? `${activeZone.mandalName} (${activeZone.districtName})` : t('noZoneSelected')}</p></div>
            <button onClick={() => { if (!activeZone.mandalId) { addToast(t('zoneRequired'), 'error'); return; } setListingModal(activeTab); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"><PlusCircle className="w-4 h-4" />{t('addListing')}</button>
          </div>

          {!activeZone.mandalId ? (
            <div className="flex flex-col items-center justify-center py-20 text-center"><MapPin className="w-12 h-12 text-slate-700 mb-3" /><p className="text-slate-500">{t('noZoneSelected')}</p><button onClick={() => { setTempZone({ stateId: null, districtId: null, mandalId: null }); setZoneModal(true); }} className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg">{t('selectZone')}</button></div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
          ) : (
            <>
              {activeTab === 'equipment' && (equipment.length === 0 ? <Empty /> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{equipment.map(e => <div key={e.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 hover:border-emerald-600/50 transition-all"><div className="flex justify-between items-start mb-1"><h4 className="font-bold text-white text-sm">{e.name}</h4><Badge text={t('available')} color="green" /></div><LocationLine item={e} /><div className="text-xs text-slate-400 mt-1">{e.specs}</div><div className="flex justify-between items-center mt-2"><span className="text-amber-400 font-bold">Rs.{e.price_per_hour}/hr</span><button onClick={() => setContactItem(e)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded"><Phone className="w-3 h-3 inline mr-1" />{t('contactToBook')}</button></div></div>)}</div>)}
              {activeTab === 'labor' && (labor.length === 0 ? <Empty /> : <div className="space-y-2">{labor.map(l => <div key={l.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3"><div className="flex justify-between items-start"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-300 font-bold text-sm">{l.profiles?.full_name?.charAt(0)}</div><div><h4 className="font-bold text-white text-sm">{l.profiles?.full_name}{l.age ? `, ${l.age}y` : ''}</h4><LocationLine item={l} /></div></div><div className="text-right"><span className="text-lg font-bold text-amber-400">Rs.{l.rate_per_day}</span><p className="text-[9px] text-slate-500">/day</p></div></div><div className="flex flex-wrap gap-1 mt-2">{l.skills.map(s => <span key={s} className="px-1.5 py-0.5 bg-slate-700/60 text-slate-300 rounded text-[10px]">{s}</span>)}</div><div className="flex justify-between items-center mt-2"><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />)}</div><button onClick={() => setContactItem(l)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded"><Phone className="w-3 h-3 inline mr-1" />{t('contactLaborer')}</button></div></div>)}</div>)}
              {activeTab === 'infrastructure' && (infrastructure.length === 0 ? <Empty /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{infrastructure.map(i => <div key={i.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3"><div className="flex items-center gap-2"><div className={`w-9 h-9 rounded-lg flex items-center justify-center ${i.infra_type === 'drying_yard' ? 'bg-amber-600/20' : 'bg-blue-600/20'}`}>{i.infra_type === 'drying_yard' ? <Sun className="w-5 h-5 text-amber-400" /> : <Droplets className="w-5 h-5 text-blue-400" />}</div><div><h4 className="font-bold text-white text-sm">{i.name}</h4><LocationLine item={i} /></div></div><div className="mt-2"><div className="flex justify-between text-xs text-slate-400"><span>{i.current_usage} / {i.capacity} {i.unit}</span><span>{Math.round((i.current_usage / i.capacity) * 100)}%</span></div><div className="h-2 bg-slate-700 rounded-full mt-1"><div className={`h-full rounded-full ${i.current_usage / i.capacity > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (i.current_usage / i.capacity) * 100)}%` }} /></div></div></div>)}</div>)}
              {activeTab === 'market' && (crops.length === 0 ? <Empty /> : <div className="space-y-2">{crops.map(c => <div key={c.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3"><div className="flex justify-between items-start"><div><h4 className="font-bold text-white text-sm">{c.crop_name}</h4><LocationLine item={c} /><p className="text-[10px] text-slate-500 mt-0.5">{c.quantity} quintals • {c.profiles?.full_name}</p></div><div className="text-right"><span className="text-lg font-bold text-amber-400">Rs.{c.price_per_quintal}</span><p className="text-[9px] text-slate-500">/quintal</p></div></div><div className="flex justify-end mt-2"><button onClick={() => setContactItem(c)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded">{t('contactFarmer')}</button></div></div>)}</div>)}
              {activeTab === 'Fertilizer Store' && (agroProducts.length === 0 ? <Empty /> : <div className="space-y-3">{Array.from(new Set(agroProducts.map(p => p.user_id))).map(uid => { const prods = agroProducts.filter(p => p.user_id === uid); const pname = prods[0].profiles?.full_name; return <div key={uid} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3"><div className="flex justify-between items-center mb-2"><h4 className="font-bold text-white text-sm">{pname}'s Store</h4><Shield className="w-4 h-4 text-emerald-400" /></div><div className="space-y-1">{prods.slice(0, 4).map(p => <div key={p.id} className="bg-slate-900/60 border border-slate-700/50 rounded p-2 flex justify-between items-center"><div><span className="text-sm font-medium text-white">{p.product_name}</span><Badge text={p.product_type} color="blue" /></div><div><span className="text-amber-400 font-bold text-sm">Rs.{p.price}</span></div></div>)}</div></div> })}</div>)}
              {activeTab === 'grievance' && (grievances.length === 0 ? <Empty /> : <div className="space-y-2">{grievances.map(g => <div key={g.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3"><div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-white text-sm">{g.title}</h4><Badge text={g.status} color={g.status === 'open' ? 'red' : g.status === 'in_progress' ? 'amber' : 'green'} /><Badge text={g.category} color="blue" /></div><LocationLine item={g} /><p className="text-xs text-slate-400 mt-1">{g.description}</p><div className="flex justify-between items-center mt-2"><span className="text-[10px] text-slate-500">{g.profiles?.full_name} • {new Date(g.created_at).toLocaleDateString()}</span><button onClick={() => upvote(g.id)} disabled={g.status !== 'open'} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${g.status !== 'open' ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-700 hover:bg-emerald-700 text-slate-200'}`}><ThumbsUp className="w-3 h-3" />{g.votes}</button></div></div>)}</div>)}
            </>
          )}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800">
        <div className="flex">{tabs.map(tab => { const Icon = tab.icon; const active = activeTab === tab.id; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 ${active ? 'text-white' : 'text-slate-500'}`}>{active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />}<Icon className={`w-4 h-4 ${active ? tab.color : ''}`} /><span className="text-[9px] font-medium capitalize">{tab.id}</span></button>; })}</div>
      </nav>

      {/* Zone Selection Modal */}
      <Modal open={zoneModal} close={() => setZoneModal(false)} title={t('selectZone')}>
        <div className="space-y-3">
          <ZoneSelector value={tempZone} onChange={setTempZone} />
          <button onClick={applyZone} disabled={!tempZone.mandalId} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-sm">{t('selectZone')}</button>
        </div>
      </Modal>

      {/* Listing Modals */}
      <Modal open={listingModal === 'equipment'} close={() => setListingModal(null)} title={t('equipment')}>{activeZone.mandalId && <EqForm zone={activeZone as any} onSave={saveEquipment} />}</Modal>
      <Modal open={listingModal === 'labor'} close={() => setListingModal(null)} title={t('labor')}>{activeZone.mandalId && <LabForm zone={activeZone as any} onSave={saveLabor} />}</Modal>
      <Modal open={listingModal === 'infrastructure'} close={() => setListingModal(null)} title={t('infra')}>{activeZone.mandalId && <InfraForm zone={activeZone as any} onSave={saveInfra} />}</Modal>
      <Modal open={listingModal === 'market'} close={() => setListingModal(null)} title={t('market')}>{activeZone.mandalId && <CropForm zone={activeZone as any} onSave={saveCrop} />}</Modal>
      <Modal open={listingModal === 'Fertilizer Store'} close={() => setListingModal(null)} title={t('Fertilizer')}>{activeZone.mandalId && <AgroForm zone={activeZone as any} onSave={saveAgro} />}</Modal>
      <Modal open={listingModal === 'grievance'} close={() => setListingModal(null)} title={t('grievance')}>{activeZone.mandalId && <GrvForm zone={activeZone as any} onSave={saveGrv} />}</Modal>

      {/* Contact Modal */}
      <ContactModal open={!!contactItem} close={() => setContactItem(null)} item={contactItem} />

      {/* My Listings Modal */}
      <MyListingsModal open={myListingsModal} close={() => setMyListingsModal(false)} userId={user!.id} refresh={fetchData} toast={addToast} />
    </div>
  );
}

function MyListingsModal({ open, close, userId, refresh, toast }: { open: boolean; close: () => void; userId: string; refresh: () => void; toast: (m: string, t: 'success' | 'error' | 'info') => void }) {
  const { t } = useLang();
  const [tab, setTab] = useState('equipment');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const tables: Record<string, string> = { equipment: 'equipment_listings', labor: 'labor_listings', infrastructure: 'infrastructure_listings', market: 'crop_listings', 'fertilizer store': 'agro_products', grievance: 'grievances' };
  useEffect(() => { if (open) { setLoading(true); supabase.from(tables[tab]).select('*').eq('user_id', userId).then(({ data }) => { setListings(data || []); setLoading(false); }); } }, [open, tab]);

  const del = async (id: string) => { await supabase.from(tables[tab]).delete().eq('id', id); toast('Deleted', 'success'); setListings(l => l.filter(i => i.id !== id)); refresh(); };

  return (
    <Modal open={open} close={close} title={t('myListings')}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">{Object.keys(tables).map(k => <button key={k} onClick={() => setTab(k)} className={`px-2 py-1 rounded text-xs font-medium ${tab === k ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{k}</button>)}</div>
        {loading ? <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div> : listings.length === 0 ? <div className="py-8 text-center text-slate-500">No listings</div> : <div className="space-y-1.5 max-h-[300px] overflow-y-auto">{listings.map(l => <div key={l.id} className="bg-slate-800 rounded p-2 flex justify-between items-center"><div className="text-xs text-white font-medium">{l.name || l.crop_name || l.product_name || l.title}</div><button onClick={() => del(l.id)} className="p-1 hover:bg-red-900/50 text-red-400 rounded"><Trash2 className="w-3.5 h-3.5" /></button></div>)}</div>}
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>;
  if (!user) return <AuthScreen onSuccess={() => { }} />;
  return <Dashboard />;
}

export default function App() {
  return <LanguageProvider><AuthProvider><AppContent /></AuthProvider></LanguageProvider>;
}
