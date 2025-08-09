import { Grid } from "@mui/material";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "derived";

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

export default function FieldPalette({ onAddField }: FieldPaletteProps) {
  const types: FieldType[] = [
    "text",
    "number",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "date",
    "derived",
  ];

  return (
    <Grid container spacing={1} sx={{ mb: 2 }}>
      {types.map((type) => (
        <div key={type}>
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="bg-[#f4f4f4] hover:bg-blue-50 border border-slate-400 hover:border-blue-300
                           rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600
                           transition-all duration-200 ease-out
                           hover:shadow-md active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
          >
            {type}
          </button>
        </div>
      ))}
    </Grid>
  );
}
