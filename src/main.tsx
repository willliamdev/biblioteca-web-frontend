import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import App from './App.tsx';

// Estilos obrigatórios do Mantine
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

// Configura o idioma das datas para Português do Brasil
dayjs.locale('pt-br');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
