import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'primary' | 'soft' | 'ghost' | 'success'; children: ReactNode };
export function Button({ variant = 'outline', className, children, ...props }: Props) {
  return <button className={cn('app-button', `app-button--${variant}`, className)} {...props}>{children}</button>;
}
