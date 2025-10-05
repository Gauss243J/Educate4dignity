export type Currency = 'USD'|'EUR'|'BIF'|'RWF'|'TZS'|'CDF';

export interface Settings {
  organization: {
    legalName: string;
    country: string;
    address?: string;
    email?: string;
    phone?: string;
    logoUrl?: string;
  };
  preferences: { languages: string[]; defaultLang: 'FR'|'EN'; timezone: string; };
  finances: { defaultCurrency: Currency; adminFeeCapPct: number };
  security: { passwordPolicy: string; admin2FA: boolean };
  transparency: {
    publicRequirements: { linkExpenseToMilestone:boolean; receiptsRequired:boolean; aggregatePlanCollectSpend:boolean; anonymizePersonal:boolean };
    page: { active: boolean; publicUrl?: string };
  };
  // Integrations are state display only here (env-managed secrets)
  integrations: { stripe: 'env'|'off'; mobileMoney: 'env'|'off' };
}

const STORAGE_KEY = 'e4d.settings.v1';

function seed(): Settings {
  return {
    organization: { legalName: 'Educate4Dignity', country: 'BI', email: 'contact@e4d.org' },
    preferences: { languages: ['FR','EN'], defaultLang: 'FR', timezone: 'Africa/Kigali' },
    finances: { defaultCurrency: 'USD', adminFeeCapPct: 10 },
    security: { passwordPolicy: 'Min 12 caractères, complexité moyenne, exp. 180 jours', admin2FA: true },
    transparency: { publicRequirements: { linkExpenseToMilestone:true, receiptsRequired:true, aggregatePlanCollectSpend:true, anonymizePersonal:true }, page: { active:true, publicUrl:'https://e4d.org/transparency' } },
    integrations: { stripe:'env', mobileMoney:'env' }
  };
}

function load(): Settings {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw) as Settings: persist(seed()); } catch { return persist(seed()); }
}
function persist(s: Settings): Settings { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return s; }

export const settingsStore = {
  get(): Settings { return load(); },
  update(patch: Partial<Settings>): Settings { const cur = load(); return persist({ ...cur, ...patch, organization:{...cur.organization, ...(patch.organization||{})}, preferences:{...cur.preferences, ...(patch.preferences||{})}, finances:{...cur.finances, ...(patch.finances||{})}, security:{...cur.security, ...(patch.security||{})}, transparency:{...cur.transparency, ...(patch.transparency||{})}, integrations:{...cur.integrations, ...(patch.integrations||{})} }); },
  reset(): Settings { return persist(seed()); }
};
