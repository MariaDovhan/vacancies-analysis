import React from 'react';
import { SHARED_APP_NAME } from '@vacancies-analysis/shared';
import './App.css';

export const App: React.FC = () => {
  return (
    <main>
      <h1>Vacancies Analysis Dashboard</h1>
      <p>Ласкаво просимо до аналізу ринку вакансій: {SHARED_APP_NAME}</p>
      <div className="card">
        <p>Frontend запущено успішно.</p>
      </div>
    </main>
  );
};

export default App;
