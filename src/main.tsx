import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installButtonHaptics } from './utils/haptics.ts';

installButtonHaptics();

createRoot(document.getElementById('root')!).render(<App />);
