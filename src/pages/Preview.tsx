import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setForms, openForm, closeForm } from "../store/slices/previewSlice";

type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "derived";

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
  options?: string[];
  derivedParents: string[];
  derivedFormula: string;
}

export default function PreviewPage() {
  const dispatch = useAppDispatch();
  const { forms, activeForm, fields } = useAppSelector((s) => s.preview);

  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => {
      try {
        return Array.isArray(JSON.parse(localStorage.getItem(k) || ""));
      } catch {
        return false;
      }
    });
    dispatch(setForms(keys));
  }, [dispatch]);

  const loadSchema = (name: string) => {
    const raw = localStorage.getItem(name);
    if (!raw) return;
    const schema: Field[] = JSON.parse(raw);
    dispatch(openForm({ name, fields: schema }));

    const init: Record<string, any> = {};
    schema.forEach((f) => {
      if (f.type === "checkbox" && (f.options?.length ?? 0) > 0)
        init[f.id] = [];
      else if (f.type === "checkbox") init[f.id] = false;
      else init[f.id] = f.defaultValue ?? "";
    });
    setValues(init);
    setErrors({});
  };

  // recompute derived fields on change
  const handleChange = (id: string, val: any) => {
    setValues((prev) => {
      const next = { ...prev, [id]: val };
      fields
        .filter((f) => f.type === "derived")
        .forEach((f) => {
          try {
            // eslint-disable-next-line no-new-func
            const fn = new Function("values", `return ${f.derivedFormula}`);
            next[f.id] = fn(next);
          } catch {
            next[f.id] = "";
          }
        });
      return next;
    });
  };

  //checkbox multi-option helper
  const toggleOption = (fid: string, opt: string) => {
    const current: string[] = values[fid] || [];
    const newArr = current.includes(opt)
      ? current.filter((o) => o !== opt)
      : [...current, opt];
    handleChange(fid, newArr);
  };

  const validateField = (f: Field): string => {
    const v = values[f.id];
    const toStr = Array.isArray(v) ? v.join(",") : `${v || ""}`.trim();

    if (f.required && f.validations.notEmpty) {
      if (Array.isArray(v) ? v.length === 0 : !toStr) return "Required";
    }
    if (f.validations.minLength && toStr.length < f.validations.minLength)
      return `Min ${f.validations.minLength} chars`;
    if (f.validations.maxLength && toStr.length > f.validations.maxLength)
      return `Max ${f.validations.maxLength} chars`;
    if (f.validations.email && !/^\S+@\S+\.\S+$/.test(toStr))
      return "Invalid email";
    if (f.validations.password && !/(?=.*\d).{8,}/.test(toStr))
      return "Password needs 8+ chars & a number";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      const err = validateField(f);
      if (err) errs[f.id] = err;
    });
    setErrors(errs);
    if (!Object.keys(errs).length) alert("✅ All inputs are valid!");
  };

  if (!activeForm)
    return (
      <Box p={2}>
        <Typography variant="h5" gutterBottom>
          Saved Forms
        </Typography>
        {forms.length === 0 && <Typography>No saved schemas.</Typography>}
        <Grid container spacing={2}>
          {forms.map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Card>
                <CardActionArea onClick={() => loadSchema(n)}>
                  <CardContent>
                    <Typography variant="h6">{n}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );

  return (
    <Box p={2}>
      <Button onClick={() => dispatch(closeForm())} sx={{ mb: 2 }}>
        ← Back to forms
      </Button>
      <Typography variant="h5" gutterBottom>
        Preview: {activeForm}
      </Typography>

      <form onSubmit={handleSubmit}>
        {fields.map((f) => {
          const err = errors[f.id];
          const opts =
            f.options?.length && f.options.length > 0
              ? f.options
              : (f.defaultValue || "")
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean);

          switch (f.type) {
            case "text":
            case "number":
            case "date":
              return (
                <TextField
                  key={f.id}
                  type={f.type}
                  label={f.label}
                  value={values[f.id] || ""}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  fullWidth
                  margin="normal"
                  error={!!err}
                  helperText={err}
                />
              );

            case "textarea":
              return (
                <TextField
                  key={f.id}
                  label={f.label}
                  value={values[f.id] || ""}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!err}
                  helperText={err}
                />
              );

            case "select":
              return (
                <TextField
                  key={f.id}
                  select
                  label={f.label}
                  value={values[f.id] || ""}
                  onChange={(e) => handleChange(f.id, e.target.value)}
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

            case "radio":
              return (
                <FormControl
                  key={f.id}
                  component="fieldset"
                  margin="normal"
                  error={!!err}
                >
                  <FormLabel>{f.label}</FormLabel>
                  <RadioGroup
                    value={values[f.id] || ""}
                    onChange={(e) => handleChange(f.id, e.target.value)}
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

            case "checkbox":
              // multi-option checkbox list
              if (opts.length > 0) {
                return (
                  <Fragment key={f.id}>
                    <FormLabel sx={{ mt: 2 }}>{f.label}</FormLabel>
                    {opts.map((o) => (
                      <FormControlLabel
                        key={o}
                        control={
                          <Checkbox
                            checked={(values[f.id] || []).includes(o)}
                            onChange={() => toggleOption(f.id, o)}
                          />
                        }
                        label={o}
                      />
                    ))}
                    {err && (
                      <Typography color="error" variant="caption">
                        {err}
                      </Typography>
                    )}
                  </Fragment>
                );
              }
              // single checkbox toggle
              return (
                <FormControlLabel
                  key={f.id}
                  control={
                    <Checkbox
                      checked={!!values[f.id]}
                      onChange={(e) => handleChange(f.id, e.target.checked)}
                    />
                  }
                  label={f.label}
                />
              );

            case "derived":
              return (
                <TextField
                  key={f.id}
                  label={f.label}
                  value={values[f.id] || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              );

            default:
              return null;
          }
        })}

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
}
