import { cn } from '@/lib/utils';

interface CurvedSectionProps {
  children: React.ReactNode;
  className?: string;
  curveTop?: boolean;
  curveBottom?: boolean;
  backgroundColor?: string;
}

export function CurvedSection({ 
  children, 
  className, 
  curveTop = false, 
  curveBottom = false,
  backgroundColor = 'bg-background'
}: CurvedSectionProps) {
  return (
    <div className={cn('relative', backgroundColor, className)}>
      {curveTop && (
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none -translate-y-[1px]">
          <svg
            className="relative block w-full h-12 md:h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-background"
            />
          </svg>
        </div>
      )}
      <div className="relative">
        {children}
      </div>
      {curveBottom && (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none translate-y-[1px]">
          <svg
            className="relative block w-full h-12 md:h-16 rotate-180"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-background"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
