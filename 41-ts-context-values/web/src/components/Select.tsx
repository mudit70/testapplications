/** A select of the app's own: it hands the chosen value to onValueChange. */
export function Select({
  value,
  options,
  onValueChange,
}: {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
