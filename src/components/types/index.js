import PropTypes from 'prop-types';

export const nullableString = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.oneOf([null]),
]);

export const classNameType = PropTypes.string;

