import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale, Language, Currency, languageNames, languageFlags, currencyNames } from '@/context/LocaleContext';

export function LocaleSelector() {
  const { language, setLanguage, currency, setCurrency } = useLocale();

  const languages: Language[] = ['en', 'fr', 'de', 'es'];
  const currencies: Currency[] = ['GBP', 'USD', 'EUR'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{languageFlags[language]}</span>
          <span className="text-xs">{currency}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Language</DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={language === lang ? 'bg-primary/10 text-primary' : ''}
          >
            <span className="mr-2">{languageFlags[lang]}</span>
            {languageNames[lang]}
            {language === lang && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground">Currency</DropdownMenuLabel>
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr}
            onClick={() => setCurrency(curr)}
            className={currency === curr ? 'bg-primary/10 text-primary' : ''}
          >
            {currencyNames[curr]}
            {currency === curr && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
