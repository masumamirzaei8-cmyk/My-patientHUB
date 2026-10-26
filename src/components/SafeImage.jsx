import React, { useEffect, useState } from 'react';

/**
 * <img> that never leaves an empty box behind: if the image is missing or
 * fails to load, the `fallback` node (an emoji, icon, ...) is rendered instead.
 * The fallback is handled with React state, so React keeps owning the DOM.
 */
const SafeImage = ({ src, alt = '', fallback = null, ...imgProps }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return <>{fallback}</>;
  return <img src={src} alt={alt} onError={() => setFailed(true)} {...imgProps} />;
};

export default SafeImage;
