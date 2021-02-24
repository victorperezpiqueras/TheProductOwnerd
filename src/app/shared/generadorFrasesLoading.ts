export function generarFraseLoading() {
  let frases = [
    'Time to go for a coffee... ☕',
    "Don't worry - a few bits tried to escape, but we caught them",
    "Let's take a mindfulness minute...",
    'Proving P=NP...',
    'Our algorithm is doing Scrum with sprints of 5 seconds...'
  ];
  let randomFrase = frases[Math.floor(Math.random() * frases.length)];
  return randomFrase;
}
