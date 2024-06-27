import React from 'react';
import { Path } from 'react-native-svg';
import Svg from '../Svg';
import { globalColors } from '@/design-system';

export const TabHomeInnerFill = ({ color = globalColors.grey100 }: { color: string }) => {
  return (
    <Svg height="28" viewBox="0 0 28 28" width="28">
      <Path
        d="M4.5 12.981C4.5 12.16 4.5 11.7495 4.60181 11.3687C4.69203 11.0313 4.84046 10.7122 5.04042 10.4259C5.2661 10.1028 5.58012 9.83833 6.20815 9.30946L10.9081 5.35156C12.0071 4.4261 12.5566 3.96338 13.1711 3.78672C13.7127 3.63099 14.2873 3.63099 14.8289 3.78672C15.4434 3.96338 15.9929 4.4261 17.0919 5.35156L21.7919 9.30946C22.4199 9.83833 22.7339 10.1028 22.9596 10.4259C23.1595 10.7122 23.308 11.0313 23.3982 11.3687C23.5 11.7495 23.5 12.16 23.5 12.981V18.9479C23.5 20.6281 23.5 21.4681 23.173 22.1099C22.8854 22.6744 22.4265 23.1333 21.862 23.4209C21.2202 23.7479 20.3802 23.7479 18.7 23.7479H9.3C7.61984 23.7479 6.77976 23.7479 6.13803 23.4209C5.57354 23.1333 5.1146 22.6744 4.82698 22.1099C4.5 21.4681 4.5 20.6281 4.5 18.9479V12.981Z"
        fill={color}
      />
    </Svg>
  );
};
