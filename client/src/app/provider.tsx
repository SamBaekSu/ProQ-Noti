'use client';

import store from '@/shared/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PropsWithChildren, useState } from 'react';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';

const Providers = ({ children }: PropsWithChildren) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 60000
        }
      }
    })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
