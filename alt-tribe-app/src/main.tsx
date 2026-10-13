import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* Clear the loading screen once React has painted. Waiting on the frame
   after mount avoids a flash of unstyled shell on slow connections. */
const boot = document.getElementById('boot')
if (boot) {
  requestAnimationFrame(() => {
    boot.classList.add('is-done')
    setTimeout(() => boot.remove(), 600)
  })
}
