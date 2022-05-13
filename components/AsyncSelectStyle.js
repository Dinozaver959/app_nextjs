
// useless for now - but we can import SCSS variables to JS
import { colorTextFieldBackground } from  "../styles/ColorTemplate.module.scss";


// possibly at the time of compiling this wasn't known yet
function getInitialColorMode() {
    
  const persistedPreferenceMode = window.localStorage.getItem('theme');
  const hasPersistedPreference = typeof persistedPreferenceMode === 'string';

  if (hasPersistedPreference) {
    return persistedPreferenceMode;
  }

  return 'dark';
}



export  const AsyncSelectCustomStyles = {
  option: (provided, state) => ({
    ...provided,
    color: 'white',
    //backgroundColor: '#343a3f'
    backgroundColor: state.isFocused ? '#4F575D' : '#343a3f',
  }),
  control: provided => ({
    ...provided,
    color: 'white',
    backgroundColor: '#343a3f'

    //backgroundColor: ((getInitialColorMode == "light") ? colorTextFieldBackground : '#4F575D'),    
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white'
  }),
  noOptionsMessage: provided => ({
    ...provided,
    color: 'white',
    backgroundColor: '#343a3f'    
  }),

  menu: provided => ({    // top and bottom lines on dropdown
    ...provided,
    backgroundColor: '#343a3f'
  })
}

