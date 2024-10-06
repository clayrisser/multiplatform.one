import './_layout.css'
import '@tamagui/core/reset.css'
import config from '../config/tamagui.config'
import { LoadProgressBar } from 'one'
import { SchemeProvider, useColorScheme } from '@vxrn/color-scheme'
import { Slot } from 'one'
import { isWeb, TamaguiProvider, Text } from 'tamagui'

export default function Layout() {
  return (
    <>
      {isWeb && (
        <>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="icon" href="/favicon.svg" />
        </>
      )}
      <LoadProgressBar />
      <SchemeProvider>
        <TamaguiRootProvider>
          <Slot />
        </TamaguiRootProvider>
      </SchemeProvider>
    </>
  )
}

const TamaguiRootProvider = ({ children }: { children: React.ReactNode }) => {
  const [scheme] = useColorScheme()
  return (
    <TamaguiProvider disableInjectCSS config={config} defaultTheme={scheme} disableRootThemeClass>
      {children}
    </TamaguiProvider>
  )
}
