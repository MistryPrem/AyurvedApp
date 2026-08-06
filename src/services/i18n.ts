export type Language = 'en' | 'hi';

const translations = {
  en: {
    appTitle: 'Amrutam Ayurveda',
    consultations: 'Consultations',
    shop: 'Ayurvedic Shop',
    healthRecords: 'Health Records',
    settings: 'Settings',
    searchDoctor: 'Search doctors by name, specialty...',
    searchProduct: 'Search products by name, herb...',
    searchRecord: 'Search records by tag, lab name...',
    bookConsultation: 'Book Consultation',
    addToCart: 'Add to Cart',
    cartSummary: 'Cart Summary',
    checkout: 'Checkout',
    upcomingConsultations: 'Upcoming Consultations',
    cancelBooking: 'Cancel Booking',
    filterBy: 'Filter By',
    all: 'All',
    offlineNotice: 'You are offline. Actions will be queued & synced.',
    biometricAuth: 'Authenticate with Biometrics',
    language: 'Language',
    theme: 'Theme Mode',
    dark: 'Dark',
    light: 'Light',
    back: 'Back',
    doctors: 'Doctors',
    bookings: 'Bookings',
    timeline: 'Timeline',
  },
  hi: {
    appTitle: 'अमृतम आयुर्वेद',
    consultations: 'परामर्श',
    shop: 'आयुर्वेदिक दुकान',
    healthRecords: 'स्वास्थ्य रिकॉर्ड',
    settings: 'सेटिंग्स',
    searchDoctor: 'डॉक्टर, विशेषज्ञता खोजें...',
    searchProduct: 'उत्पाद, जड़ी बूटियों की खोज करें...',
    searchRecord: 'लैब रिपोर्ट, टैग खोजें...',
    bookConsultation: 'परामर्श बुक करें',
    addToCart: 'कार्ट में जोड़ें',
    cartSummary: 'कार्ट विवरण',
    checkout: 'चेकआउट',
    upcomingConsultations: 'आगामी परामर्श',
    cancelBooking: 'रद्द करें',
    filterBy: 'फ़िल्टर करें',
    all: 'सभी',
    offlineNotice: 'आप ऑफ़लाइन हैं। कार्य कतारबद्ध और सिंक होंगे।',
    biometricAuth: 'बायोमेट्रिक से सत्यापित करें',
    language: 'भाषा',
    theme: 'थीम मोड़',
    dark: 'डार्क',
    light: 'लाइट',
    back: 'वापस',
    doctors: 'डॉक्टर्स',
    bookings: 'बुकिंग',
    timeline: 'टाइमलाइन',
  },
};

class I18nService {
  private currentLanguage: Language = 'en';
  private listeners: ((lang: Language) => void)[] = [];

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    this.listeners.forEach((l) => l(lang));
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: keyof typeof translations['en']): string {
    return translations[this.currentLanguage][key] || translations['en'][key] || key;
  }

  subscribe(listener: (lang: Language) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const i18n = new I18nService();
