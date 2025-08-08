import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
} from '@mui/material';

type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'derived';

interface ValidationRules {
  notEmpty: boolean;
  minLength?: number;
  maxLength?: number;
  email: boolean;
  password: boolean;
}

interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue: string;
  validations: ValidationRules;
  derivedParents: string[];
  derivedFormula: string;
}

export default function PreviewPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formName, setFormName] = useState<string>('');

  // Prompt for schema name & load it
  useEffect(() => {
    const name = window.prompt('Enter the form name to preview:');
    if (!name) return;
    setFormName(name);
    const raw = localStorage.getItem(name);
    if (!raw) {
      alert(`No schema found under "${name}"`);
      return;
    }
    const schema: Field[] = JSON.parse(raw);
    setFields(schema);
    // init values
    const init: Record<string, any> = {};
    schema.forEach((f) => {
      init[f.id] =
        f.type === 'checkbox'
          ? false
          : f.defaultValue || '';
    });
    setValues(init);
  }, []);

  // Recompute derived fields whenever any value changes
  const handleChange = (id: string, val: any) => {
    setValues((prev) => {
      const next = { ...prev, [id]: val };
      fields
        .filter((f) => f.type === 'derived')
        .forEach((f) => {
          try {
            // eslint-disable-next-line no-new-func
            const fn = new Function('values', `return ${f.derivedFormula}`);
            next[f.id] = fn(next);
          } catch {
            next[f.id] = '';
          }
        });
      return next;
    });
  };

  // Validation logic (run on submit)
  const validateField = (f: Field): string => {
    const v = `${values[f.id] || ''}`.trim();
    if (f.required && f.validations.notEmpty && !v) return 'Required';
    if (
      f.validations.minLength != null &&
      v.length < f.validations.minLength
    )
      return `Min ${f.validations.minLength} chars`;
    if (
      f.validations.maxLength != null &&
      v.length > f.validations.maxLength
    )
      return `Max ${f.validations.maxLength} chars`;
    if (
      f.validations.email &&
      !/^\S+@\S+\.\S+$/.test(v)
    )
      return 'Invalid email';
    if (
      f.validations.password &&
      !/(?=.*\d).{8,}/.test(v)
    )
      return 'Password needs 8+ chars & a number';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      const err = validateField(f);
      if (err) errs[f.id] = err;
    });
    setErrors(errs);
    if (!Object.keys(errs).length) {
      alert('✅ All inputs are valid!');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Preview: {formName}
      </Typography>
      <form onSubmit={handleSubmit}>
        {fields.map((f) => {
          const err = errors[f.id];
          switch (f.type) {
            case 'text':
            case 'number':
            case 'date':
              return (
                <TextField
                  key={f.id}
                  type={f.type}
                  label={f.label}
                  value={values[f.id] || ''}
                  onChange={(e) =>
                    handleChange(f.id, e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!err}
                  helperText={err}
                />
              );
            case 'textarea':
              return (
                <TextField
                  key={f.id}
                  label={f.label}
                  value={values[f.id] || ''}
                  onChange={(e) =>
                    handleChange(f.id, e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!err}
                  helperText={err}
                />
              );
            case 'select': {
              // use defaultValue CSV as options
              const opts = (f.defaultValue || '').split(',');
              return (
                <TextField
                  key={f.id}
                  select
                  label={f.label}
                  value={values[f.id] || ''}
                  onChange={(e) =>
                    handleChange(f.id, e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!err}
                  helperText={err}
                >
                  {opts.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            case 'radio': {
              const opts = (f.defaultValue || '').split(',');
              return (
                <FormControl
                  key={f.id}
                  component="fieldset"
                  margin="normal"
                  error={!!err}
                >
                  <FormLabel component="legend">
                    {f.label}
                  </FormLabel>
                  <RadioGroup
                    value={values[f.id] || ''}
                    onChange={(e) =>
                      handleChange(f.id, e.target.value)
                    }
                  >
                    {opts.map((o) => (
                      <FormControlLabel
                        key={o}
                        value={o}
                        control={<Radio />}
                        label={o}
                      />
                    ))}
                  </RadioGroup>
                  <FormHelperText>{err}</FormHelperText>
                </FormControl>
              );
            }
            case 'checkbox':
              return (
                <FormControlLabel
                  key={f.id}
                  control={
                    <Checkbox
                      checked={!!values[f.id]}
                      onChange={(e) =>
                        handleChange(f.id, e.target.checked)
                      }
                    />
                  }
                  label={f.label}
                />
              );
            case 'derived':
              return (
                <TextField
                  key={f.id}
                  label={f.label}
                  value={values[f.id] || ''}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              );
            default:
              return null;
          }
        })}
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}