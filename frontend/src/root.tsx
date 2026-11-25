import React from 'react'
import ReactDOM from 'react-dom/client'

import { PlausibleProvider } from './context/plausible-context'
import Router from './router'
import './styles.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('The #root HTML element is missing from the DOM')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <PlausibleProvider>
      <Router />
    </PlausibleProvider>
  </React.StrictMode>
)
