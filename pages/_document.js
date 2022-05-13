import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html  lang="en">
        <Head></Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: themeInitializerScript,
            }}
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// This function needs to be a String
const themeInitializerScript = `(function() {
	${setInitialColorMode.toString()}
	setInitialColorMode();
})()
`;

function setInitialColorMode() {
   // Check initial color preference
  function getInitialColorMode() {
    
    const persistedPreferenceMode = window.localStorage.getItem('theme');
    const hasPersistedPreference = typeof persistedPreferenceMode === 'string';

    if (hasPersistedPreference) {
      return persistedPreferenceMode;
    }

    /*    if you want to read from browsers' setting about the user's prefered color theme, then enable this, 
          but we want dark to be the default, unless user changes this setting
    // Check the current preference
    const preference = window.matchMedia('(prefers-color-scheme: light)');
    const hasMediaQueryPreference = typeof preference.matches === 'boolean';

    if (hasMediaQueryPreference) {
      return preference.matches ? 'light' : 'dark';
    }
  */

    return 'dark';
  }

  const currentColorMode = getInitialColorMode();
  const element = document.documentElement;
  element.style.setProperty('--initial-color-mode', currentColorMode);

  // If darkmode apply darkmode
  if (currentColorMode === 'light')
    document.documentElement.setAttribute('data-theme', 'light');
}

export default MyDocument;