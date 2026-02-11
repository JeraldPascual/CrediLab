# Components

Reusable UI components for the CrediLab app.

## Organization
- **atoms/** — Basic building blocks (Button, Input, Card)
- **organisms/** — Complex components (Editor, Leaderboard, ChallengeCard)

## Example: Button Component
```jsx
// components/Button.jsx
export default function Button({ children, onClick, variant = 'primary' }) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

## Getting Started
1. Create components using functional components + hooks
2. Use Tailwind CSS for styling (utility classes)
3. Export as default or named exports
4. Import in pages: `import Button from '../components/Button'`
