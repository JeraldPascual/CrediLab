# Pages

Route-level views for CrediLab. Each page corresponds to a URL path.

## Routes (Planned)
- `/` — Home (Landing page)
- `/login` — Authentication page
- `/editor` — Code editor + challenges
- `/leaderboard` — Global leaderboard
- `/profile` — User profile + credentials

## Example: Home Page
```jsx
// pages/Home.jsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">CrediLab</h1>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-4">Prove Your Coding Skills</h2>
        <p className="text-gray-400">Complete challenges, earn credits, get verified.</p>
      </main>
    </div>
  );
}
```

## React Router Setup (Student A)

Wire up routes in `App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}
```
