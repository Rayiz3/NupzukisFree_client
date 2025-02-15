import { MetaProvider } from '@solidjs/meta';
import { Route, Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import Pages from './pages';
import Background from './components/Background';

const App: Component = () => {
  return (
    <MetaProvider>
    <Background />
    <Router>
      <Route>
        <Pages/>
      </Route>
    </Router>
    </MetaProvider>
  );
};

export default App;
