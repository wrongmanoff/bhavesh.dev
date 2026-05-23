interface FieldErrorProps {
  error?: string;
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return <p className="mt-1 text-red-400 text-xs font-mono">{error}</p>;
}
