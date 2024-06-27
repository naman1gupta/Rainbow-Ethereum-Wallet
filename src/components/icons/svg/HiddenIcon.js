import PropTypes from 'prop-types';
import React from 'react';
import { Path } from 'react-native-svg';
import Svg from '../Svg';

const HiddenIcon = ({ color, colors, ...props }) => (
  <Svg height="10" viewBox="0 0 14 10" width="14" {...props}>
    <Path
      d="M10.722 9.01185C10.8714 9.16119 11.1094 9.16586 11.2587 9.01185C11.4128 8.85316 11.4081 8.62447 11.2587 8.47513L3.25461 0.475659C3.10527 0.32631 2.86258 0.32631 2.71323 0.475659C2.56855 0.62034 2.56855 0.867698 2.71323 1.01238L10.722 9.01185ZM11.1561 7.5277C12.5189 6.59894 13.3636 5.36215 13.3636 4.82076C13.3636 3.87333 10.8247 0.793024 6.99766 0.793024C6.20424 0.793024 5.46684 0.923703 4.7901 1.14773L6.1249 2.47786C6.3956 2.37518 6.68962 2.31451 7.00232 2.31451C8.39313 2.31451 9.51791 3.42062 9.51791 4.82076C9.51791 5.12879 9.45724 5.42749 9.34522 5.69818L11.1561 7.5277ZM6.99766 8.84383C7.84241 8.84383 8.62649 8.69915 9.32189 8.44712L7.98242 7.10766C7.68372 7.24767 7.35236 7.32701 7.00232 7.32701C5.60218 7.32701 4.48207 6.1789 4.48207 4.82076C4.4774 4.46139 4.55674 4.12536 4.69676 3.82199L2.94192 2.06248C1.50444 3.00524 0.636353 4.27004 0.636353 4.82076C0.636353 5.76352 3.22661 8.84383 6.99766 8.84383ZM8.49581 4.72275C8.49581 3.91534 7.84241 3.2526 7.02566 3.2526C6.98365 3.2526 6.94165 3.25727 6.90431 3.26194L8.49114 4.84876C8.49581 4.80676 8.49581 4.76942 8.49581 4.72275ZM5.49017 4.76475C5.49017 5.57684 6.15757 6.2349 6.96965 6.2349C7.01632 6.2349 7.05833 6.2349 7.10033 6.23023L5.49951 4.62474C5.49484 4.67141 5.49017 4.71808 5.49017 4.76475Z"
      fill={color || colors.black}
      fillRule="nonzero"
    />
  </Svg>
);

HiddenIcon.propTypes = {
  color: PropTypes.string,
};

export default HiddenIcon;
