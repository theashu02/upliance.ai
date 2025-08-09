import { Grid, Button } from '@mui/material';

export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'derived';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

export default function FieldPalette({ onAddField }: FieldPaletteProps) {
  const types: FieldType[] = [
    'text',
    'number',
    'textarea',
    'select',
    'radio',
    'checkbox',
    'date',
    'derived',
  ];

  return (
    <Grid container spacing={1} sx={{ mb: 2 }}>
      {types.map((type) => (
        <Grid item xs={6} sm={3} key={type}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onAddField(type)}
          >
            {type}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}