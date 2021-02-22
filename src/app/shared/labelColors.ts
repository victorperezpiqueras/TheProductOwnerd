export function getLabelColor(label: string) {
  if (label == 'feature') return '#00ad17';
  else if (label == 'tech-debt') return '#ffbb00';
  else if (label == 'bug') return '#ad0000';
  else if (label == 'infrastructure') return '#2196f3';
}
