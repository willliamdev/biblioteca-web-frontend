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

const theme = {
  colors: {
    bibliotecaOrange: [
      '#fff1eb',
      '#ffddcf',
      '#ffc2a8',
      '#ffa47d',
      '#ff8150',
      '#ff6730',
      '#f94d12',
      '#e64008',
      '#c93606',
      '#a92c05',
    ] as const,
  },
  primaryColor: 'bibliotecaOrange',
  primaryShade: 6 as const,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
