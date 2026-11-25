import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { setTheme } from '@/lib/set-theme'
import { Theme } from '@/schemas/settings-schema'

export default function ThemeSwitch({
  theme,
  onThemeChange
}: {
  theme: Theme
  onThemeChange(theme: Theme): void
}) {
  const handleThemeChange = (value: Theme) => {
    if (!value) return
    setTheme(value)
    onThemeChange(value)
  }
  return (
    <ToggleGroup
      value={theme}
      type='single'
      className='h-9 rounded-md border p-1'
      onValueChange={handleThemeChange}>
      <ToggleGroupItem value='light' className='size-full'>
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='system' className='size-full'>
        <DesktopIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='dark' className='size-full'>
        <MoonIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
