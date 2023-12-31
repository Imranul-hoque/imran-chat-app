import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/provider/theme-provider';
import { cn } from '@/lib/utils';
import { ModalProvider } from '@/provider/modal-provider';
import ToastProvider from '@/provider/toast-provider';
import { SocketProvider } from '@/provider/socket-provider';
import { QueryProvider } from '@/provider/query-provider';


const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'imranTeamChat',
  description: 'imranTeamChat Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>      
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          font.className,
          "bg-white dark:bg-[#313338]"
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <QueryProvider>
                <ModalProvider />
                <ToastProvider />
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
