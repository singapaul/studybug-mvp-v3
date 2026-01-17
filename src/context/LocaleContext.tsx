import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'de' | 'es';
export type Currency = 'GBP' | 'USD' | 'EUR';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatPrice: (priceGBP: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.forSchools': 'For Schools',
    'nav.resources': 'Resources',
    'nav.helpCenter': 'Help Center',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.login': 'Log In',
    'nav.startTrial': 'Start Free Trial',
    
    // Hero
    'hero.badge': '14-day free trial on all paid plans',
    'hero.title': 'Make Revision',
    'hero.titleHighlight': 'Fun',
    'hero.titleEnd': 'with Interactive Learning Games',
    'hero.subtitle': 'Join thousands of students and teachers using Studybug to master any subject through engaging game-based learning.',
    'hero.cta': 'Start Free Trial',
    'hero.secondary': 'See How It Works',
    
    // Pricing
    'pricing.title': 'Simple, transparent pricing',
    'pricing.subtitle': 'Choose the plan that\'s right for you. All paid plans include a 14-day free trial.',
    'pricing.monthly': 'Monthly',
    'pricing.annual': 'Annual',
    'pricing.save': 'Save 25%',
    'pricing.perMonth': '/month',
    'pricing.billedAnnually': 'Billed annually as',
    'pricing.freeForever': 'Free forever',
    'pricing.customPricing': 'Custom Pricing',
    'pricing.contactUs': 'Contact us for a quote',
    'pricing.noCreditCard': 'No credit card required • 14-day free trial • Cancel anytime',
    
    // Plans
    'plan.free': 'Free',
    'plan.student': 'Student',
    'plan.teacher': 'Teacher',
    'plan.school': 'School',
    'plan.free.subtitle': 'Perfect for trying out',
    'plan.student.subtitle': 'Perfect for independent learners',
    'plan.teacher.subtitle': 'Everything students get, plus classroom tools',
    'plan.school.subtitle': 'For schools, academies & institutions',
    
    // Badges
    'badge.mostPopular': 'Most Popular',
    'badge.bestForEducators': 'Best for Educators',
    'badge.enterprise': 'Enterprise',
    
    // Trust
    'trust.trusted': 'Trusted by',
    'trust.studentsTeachers': '1,000+ students and teachers',
    'trust.acrossUK': 'across the UK',
    'trust.gdpr': 'GDPR Compliant',
    'trust.gdprDesc': 'Your data is protected',
    'trust.secure': 'Secure Payments',
    'trust.secureDesc': 'SSL encrypted',
    'trust.moneyBack': '14-Day Money-Back',
    'trust.moneyBackDesc': 'Full refund guarantee',
    'trust.ukSupport': 'UK-Based Support',
    'trust.ukSupportDesc': 'Fast responses',
    
    // Stats
    'stats.schools': 'UK Schools',
    'stats.students': 'Students',
    'stats.improvement': 'Improvement',
    
    // Urgency
    'urgency.message': 'January offer: Save 25% on annual plans',
    'urgency.endsIn': 'Ends in:',
    'urgency.days': 'days',
    'urgency.hrs': 'hrs',
    'urgency.min': 'min',
    'urgency.sec': 'sec',
    
    // Demo
    'demo.badge': 'Try it yourself',
    'demo.title': 'Experience Studybug in Action',
    'demo.subtitle': 'Flip the cards and test your knowledge. This is just a taste of our interactive learning!',
    'demo.question': 'Question',
    'demo.answer': 'Answer',
    'demo.tapToReveal': 'Tap to reveal answer',
    'demo.tapCard': 'Tap the card to reveal the answer',
    'demo.gotItWrong': 'Got it wrong',
    'demo.gotItRight': 'Got it right',
    'demo.perfectScore': 'Perfect Score!',
    'demo.greatJob': 'Great job!',
    'demo.tryAgain': 'Try Again',
    
    // Sticky CTA
    'stickyCta.title': 'Ready to boost your grades?',
    'stickyCta.subtitle': 'Start your 14-day free trial now',
    'stickyCta.button': 'Start Free',
    
    // Money Back
    'moneyBack.title': '14-Day Money-Back Guarantee',
    'moneyBack.subtitle': 'Not satisfied? Get a full refund, no questions asked.',
  },
  fr: {
    // Navigation
    'nav.features': 'Fonctionnalités',
    'nav.howItWorks': 'Comment ça marche',
    'nav.pricing': 'Tarifs',
    'nav.forSchools': 'Pour les écoles',
    'nav.resources': 'Ressources',
    'nav.helpCenter': 'Centre d\'aide',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.login': 'Connexion',
    'nav.startTrial': 'Essai gratuit',
    
    // Hero
    'hero.badge': 'Essai gratuit de 14 jours sur tous les plans payants',
    'hero.title': 'Rendez les révisions',
    'hero.titleHighlight': 'Amusantes',
    'hero.titleEnd': 'avec des jeux d\'apprentissage interactifs',
    'hero.subtitle': 'Rejoignez des milliers d\'étudiants et d\'enseignants utilisant Studybug pour maîtriser n\'importe quel sujet grâce à un apprentissage ludique.',
    'hero.cta': 'Commencer l\'essai gratuit',
    'hero.secondary': 'Voir comment ça marche',
    
    // Pricing
    'pricing.title': 'Tarification simple et transparente',
    'pricing.subtitle': 'Choisissez le plan qui vous convient. Tous les plans payants incluent un essai gratuit de 14 jours.',
    'pricing.monthly': 'Mensuel',
    'pricing.annual': 'Annuel',
    'pricing.save': 'Économisez 25%',
    'pricing.perMonth': '/mois',
    'pricing.billedAnnually': 'Facturé annuellement à',
    'pricing.freeForever': 'Gratuit pour toujours',
    'pricing.customPricing': 'Tarif personnalisé',
    'pricing.contactUs': 'Contactez-nous pour un devis',
    'pricing.noCreditCard': 'Pas de carte bancaire requise • Essai gratuit de 14 jours • Annulez à tout moment',
    
    // Plans
    'plan.free': 'Gratuit',
    'plan.student': 'Étudiant',
    'plan.teacher': 'Enseignant',
    'plan.school': 'École',
    'plan.free.subtitle': 'Parfait pour essayer',
    'plan.student.subtitle': 'Parfait pour les apprenants autonomes',
    'plan.teacher.subtitle': 'Tout ce que les étudiants ont, plus des outils de classe',
    'plan.school.subtitle': 'Pour les écoles, académies et institutions',
    
    // Badges
    'badge.mostPopular': 'Plus populaire',
    'badge.bestForEducators': 'Meilleur pour les éducateurs',
    'badge.enterprise': 'Entreprise',
    
    // Trust
    'trust.trusted': 'Approuvé par',
    'trust.studentsTeachers': '1 000+ étudiants et enseignants',
    'trust.acrossUK': 'au Royaume-Uni',
    'trust.gdpr': 'Conforme RGPD',
    'trust.gdprDesc': 'Vos données sont protégées',
    'trust.secure': 'Paiements sécurisés',
    'trust.secureDesc': 'Chiffrement SSL',
    'trust.moneyBack': 'Garantie 14 jours',
    'trust.moneyBackDesc': 'Remboursement intégral',
    'trust.ukSupport': 'Support au Royaume-Uni',
    'trust.ukSupportDesc': 'Réponses rapides',
    
    // Stats
    'stats.schools': 'Écoles UK',
    'stats.students': 'Étudiants',
    'stats.improvement': 'Amélioration',
    
    // Urgency
    'urgency.message': 'Offre de janvier : Économisez 25% sur les plans annuels',
    'urgency.endsIn': 'Se termine dans :',
    'urgency.days': 'jours',
    'urgency.hrs': 'h',
    'urgency.min': 'min',
    'urgency.sec': 's',
    
    // Demo
    'demo.badge': 'Essayez vous-même',
    'demo.title': 'Découvrez Studybug en action',
    'demo.subtitle': 'Retournez les cartes et testez vos connaissances. Ce n\'est qu\'un aperçu de notre apprentissage interactif !',
    'demo.question': 'Question',
    'demo.answer': 'Réponse',
    'demo.tapToReveal': 'Appuyez pour révéler la réponse',
    'demo.tapCard': 'Appuyez sur la carte pour révéler la réponse',
    'demo.gotItWrong': 'Mauvaise réponse',
    'demo.gotItRight': 'Bonne réponse',
    'demo.perfectScore': 'Score parfait !',
    'demo.greatJob': 'Excellent travail !',
    'demo.tryAgain': 'Réessayer',
    
    // Sticky CTA
    'stickyCta.title': 'Prêt à améliorer vos notes ?',
    'stickyCta.subtitle': 'Commencez votre essai gratuit de 14 jours',
    'stickyCta.button': 'Commencer',
    
    // Money Back
    'moneyBack.title': 'Garantie de remboursement de 14 jours',
    'moneyBack.subtitle': 'Pas satisfait ? Obtenez un remboursement complet, sans questions.',
  },
  de: {
    // Navigation
    'nav.features': 'Funktionen',
    'nav.howItWorks': 'So funktioniert\'s',
    'nav.pricing': 'Preise',
    'nav.forSchools': 'Für Schulen',
    'nav.resources': 'Ressourcen',
    'nav.helpCenter': 'Hilfe-Center',
    'nav.contact': 'Kontakt',
    'nav.blog': 'Blog',
    'nav.login': 'Anmelden',
    'nav.startTrial': 'Kostenlos testen',
    
    // Hero
    'hero.badge': '14-tägige kostenlose Testversion bei allen kostenpflichtigen Plänen',
    'hero.title': 'Machen Sie das Lernen',
    'hero.titleHighlight': 'Spaßig',
    'hero.titleEnd': 'mit interaktiven Lernspielen',
    'hero.subtitle': 'Schließen Sie sich Tausenden von Schülern und Lehrern an, die Studybug nutzen, um jedes Fach durch spielbasiertes Lernen zu meistern.',
    'hero.cta': 'Kostenlos testen',
    'hero.secondary': 'So funktioniert\'s',
    
    // Pricing
    'pricing.title': 'Einfache, transparente Preise',
    'pricing.subtitle': 'Wählen Sie den Plan, der zu Ihnen passt. Alle kostenpflichtigen Pläne beinhalten eine 14-tägige kostenlose Testversion.',
    'pricing.monthly': 'Monatlich',
    'pricing.annual': 'Jährlich',
    'pricing.save': '25% sparen',
    'pricing.perMonth': '/Monat',
    'pricing.billedAnnually': 'Jährlich abgerechnet als',
    'pricing.freeForever': 'Für immer kostenlos',
    'pricing.customPricing': 'Individuelle Preise',
    'pricing.contactUs': 'Kontaktieren Sie uns für ein Angebot',
    'pricing.noCreditCard': 'Keine Kreditkarte erforderlich • 14 Tage kostenlos testen • Jederzeit kündbar',
    
    // Plans
    'plan.free': 'Kostenlos',
    'plan.student': 'Schüler',
    'plan.teacher': 'Lehrer',
    'plan.school': 'Schule',
    'plan.free.subtitle': 'Perfekt zum Ausprobieren',
    'plan.student.subtitle': 'Perfekt für selbstständige Lernende',
    'plan.teacher.subtitle': 'Alles was Schüler haben, plus Klassenzimmer-Tools',
    'plan.school.subtitle': 'Für Schulen, Akademien und Institutionen',
    
    // Badges
    'badge.mostPopular': 'Am beliebtesten',
    'badge.bestForEducators': 'Beste für Pädagogen',
    'badge.enterprise': 'Unternehmen',
    
    // Trust
    'trust.trusted': 'Vertraut von',
    'trust.studentsTeachers': '1.000+ Schülern und Lehrern',
    'trust.acrossUK': 'in Großbritannien',
    'trust.gdpr': 'DSGVO-konform',
    'trust.gdprDesc': 'Ihre Daten sind geschützt',
    'trust.secure': 'Sichere Zahlungen',
    'trust.secureDesc': 'SSL-verschlüsselt',
    'trust.moneyBack': '14-Tage-Geld-zurück',
    'trust.moneyBackDesc': 'Volle Rückerstattung',
    'trust.ukSupport': 'UK-basierter Support',
    'trust.ukSupportDesc': 'Schnelle Antworten',
    
    // Stats
    'stats.schools': 'UK-Schulen',
    'stats.students': 'Schüler',
    'stats.improvement': 'Verbesserung',
    
    // Urgency
    'urgency.message': 'Januar-Angebot: Sparen Sie 25% bei Jahresplänen',
    'urgency.endsIn': 'Endet in:',
    'urgency.days': 'Tage',
    'urgency.hrs': 'Std',
    'urgency.min': 'Min',
    'urgency.sec': 'Sek',
    
    // Demo
    'demo.badge': 'Probieren Sie es selbst',
    'demo.title': 'Erleben Sie Studybug in Aktion',
    'demo.subtitle': 'Drehen Sie die Karten um und testen Sie Ihr Wissen. Dies ist nur ein Vorgeschmack auf unser interaktives Lernen!',
    'demo.question': 'Frage',
    'demo.answer': 'Antwort',
    'demo.tapToReveal': 'Tippen zum Aufdecken',
    'demo.tapCard': 'Tippen Sie auf die Karte, um die Antwort zu sehen',
    'demo.gotItWrong': 'Falsch',
    'demo.gotItRight': 'Richtig',
    'demo.perfectScore': 'Perfekte Punktzahl!',
    'demo.greatJob': 'Großartige Arbeit!',
    'demo.tryAgain': 'Erneut versuchen',
    
    // Sticky CTA
    'stickyCta.title': 'Bereit, Ihre Noten zu verbessern?',
    'stickyCta.subtitle': 'Starten Sie jetzt Ihre 14-tägige kostenlose Testversion',
    'stickyCta.button': 'Kostenlos starten',
    
    // Money Back
    'moneyBack.title': '14-Tage-Geld-zurück-Garantie',
    'moneyBack.subtitle': 'Nicht zufrieden? Erhalten Sie eine volle Rückerstattung, ohne Fragen.',
  },
  es: {
    // Navigation
    'nav.features': 'Características',
    'nav.howItWorks': 'Cómo funciona',
    'nav.pricing': 'Precios',
    'nav.forSchools': 'Para escuelas',
    'nav.resources': 'Recursos',
    'nav.helpCenter': 'Centro de ayuda',
    'nav.contact': 'Contacto',
    'nav.blog': 'Blog',
    'nav.login': 'Iniciar sesión',
    'nav.startTrial': 'Prueba gratis',
    
    // Hero
    'hero.badge': 'Prueba gratuita de 14 días en todos los planes de pago',
    'hero.title': 'Haz que estudiar sea',
    'hero.titleHighlight': 'Divertido',
    'hero.titleEnd': 'con juegos de aprendizaje interactivos',
    'hero.subtitle': 'Únete a miles de estudiantes y profesores que usan Studybug para dominar cualquier tema a través del aprendizaje basado en juegos.',
    'hero.cta': 'Comenzar prueba gratis',
    'hero.secondary': 'Ver cómo funciona',
    
    // Pricing
    'pricing.title': 'Precios simples y transparentes',
    'pricing.subtitle': 'Elige el plan adecuado para ti. Todos los planes de pago incluyen una prueba gratuita de 14 días.',
    'pricing.monthly': 'Mensual',
    'pricing.annual': 'Anual',
    'pricing.save': 'Ahorra 25%',
    'pricing.perMonth': '/mes',
    'pricing.billedAnnually': 'Facturado anualmente como',
    'pricing.freeForever': 'Gratis para siempre',
    'pricing.customPricing': 'Precios personalizados',
    'pricing.contactUs': 'Contáctanos para una cotización',
    'pricing.noCreditCard': 'No se requiere tarjeta de crédito • Prueba gratuita de 14 días • Cancela en cualquier momento',
    
    // Plans
    'plan.free': 'Gratis',
    'plan.student': 'Estudiante',
    'plan.teacher': 'Profesor',
    'plan.school': 'Escuela',
    'plan.free.subtitle': 'Perfecto para probar',
    'plan.student.subtitle': 'Perfecto para estudiantes independientes',
    'plan.teacher.subtitle': 'Todo lo que tienen los estudiantes, más herramientas de aula',
    'plan.school.subtitle': 'Para escuelas, academias e instituciones',
    
    // Badges
    'badge.mostPopular': 'Más popular',
    'badge.bestForEducators': 'Mejor para educadores',
    'badge.enterprise': 'Empresarial',
    
    // Trust
    'trust.trusted': 'Confiado por',
    'trust.studentsTeachers': '1.000+ estudiantes y profesores',
    'trust.acrossUK': 'en el Reino Unido',
    'trust.gdpr': 'Compatible con RGPD',
    'trust.gdprDesc': 'Tus datos están protegidos',
    'trust.secure': 'Pagos seguros',
    'trust.secureDesc': 'Cifrado SSL',
    'trust.moneyBack': 'Garantía de 14 días',
    'trust.moneyBackDesc': 'Reembolso completo',
    'trust.ukSupport': 'Soporte en Reino Unido',
    'trust.ukSupportDesc': 'Respuestas rápidas',
    
    // Stats
    'stats.schools': 'Escuelas UK',
    'stats.students': 'Estudiantes',
    'stats.improvement': 'Mejora',
    
    // Urgency
    'urgency.message': 'Oferta de enero: Ahorra 25% en planes anuales',
    'urgency.endsIn': 'Termina en:',
    'urgency.days': 'días',
    'urgency.hrs': 'hrs',
    'urgency.min': 'min',
    'urgency.sec': 'seg',
    
    // Demo
    'demo.badge': 'Pruébalo tú mismo',
    'demo.title': 'Experimenta Studybug en acción',
    'demo.subtitle': 'Voltea las tarjetas y pon a prueba tus conocimientos. ¡Esto es solo una muestra de nuestro aprendizaje interactivo!',
    'demo.question': 'Pregunta',
    'demo.answer': 'Respuesta',
    'demo.tapToReveal': 'Toca para revelar la respuesta',
    'demo.tapCard': 'Toca la tarjeta para revelar la respuesta',
    'demo.gotItWrong': 'Incorrecto',
    'demo.gotItRight': 'Correcto',
    'demo.perfectScore': '¡Puntuación perfecta!',
    'demo.greatJob': '¡Excelente trabajo!',
    'demo.tryAgain': 'Intentar de nuevo',
    
    // Sticky CTA
    'stickyCta.title': '¿Listo para mejorar tus notas?',
    'stickyCta.subtitle': 'Comienza tu prueba gratuita de 14 días ahora',
    'stickyCta.button': 'Comenzar gratis',
    
    // Money Back
    'moneyBack.title': 'Garantía de devolución de 14 días',
    'moneyBack.subtitle': '¿No estás satisfecho? Obtén un reembolso completo, sin preguntas.',
  },
};

const currencyRates: Record<Currency, { symbol: string; rate: number }> = {
  GBP: { symbol: '£', rate: 1 },
  USD: { symbol: '$', rate: 1.27 },
  EUR: { symbol: '€', rate: 1.17 },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('studybug-language');
    return (saved as Language) || 'en';
  });
  
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('studybug-currency');
    return (saved as Currency) || 'GBP';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('studybug-language', lang);
  };

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('studybug-currency', curr);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const formatPrice = (priceGBP: number): string => {
    const { symbol, rate } = currencyRates[currency];
    const convertedPrice = priceGBP * rate;
    
    if (priceGBP === 0) {
      return `${symbol}0`;
    }
    
    // Round to 2 decimal places
    const formattedPrice = Math.round(convertedPrice * 100) / 100;
    
    // Format based on currency
    if (currency === 'EUR') {
      return `${formattedPrice.toFixed(2).replace('.', ',')}${symbol}`;
    }
    
    return `${symbol}${formattedPrice % 1 === 0 ? formattedPrice : formattedPrice.toFixed(2)}`;
  };

  return (
    <LocaleContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      currency,
      setCurrency: handleSetCurrency,
      t,
      formatPrice,
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
};

export const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
};

export const currencyNames: Record<Currency, string> = {
  GBP: 'GBP (£)',
  USD: 'USD ($)',
  EUR: 'EUR (€)',
};
