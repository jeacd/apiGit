import { useColorScheme } from '@/hooks/useColorScheme';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function GitHubIcon({ size = 24, color }: { size?: number; color?: string }) {
  const theme = useColorScheme();

  const fillColor =
    color ||
    (theme === 'dark' ? '#FFFFFF' : '#000000');

  return (
    <Svg
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill={fillColor}
    >
      <Path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.4-1.7-1.4-1.7-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3.2 1.4 4 .9.1-.9.5-1.4.9-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.5.4 1 .9 1 2v3c0 .3.2.7.8.6C20.2 21.4 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </Svg>
  );
}
