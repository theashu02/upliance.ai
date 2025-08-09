import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import FieldPalette from "../components/FieldPalette";
import {
  addField,
  selectField,
  updateField,
  removeField,
  moveField,
} from "../store/slices/formBuilderSlice";

export default function CreateForm() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { fields, selectedId } = useAppSelector((s) => s.formBuilder);
  const selected = fields.find((f) => f.id === selectedId);

  /* ---------- save schema ---------- */
  const handleSave = () => {
    const name = window.prompt("Enter a name for this form schema:");
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(fields));
    alert(`Saved schema under key "${name}"`);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Left */}
      <Box flex={1}>
        <Typography variant="h6" gutterBottom>
          Add Field
        </Typography>
        <FieldPalette onAddField={(t) => dispatch(addField(t))} />

        <Typography variant="h6" gutterBottom>
          Fields
        </Typography>
        {fields.map((fld) => (
          <Paper
            key={fld.id}
            sx={{
              p: 1,
              mb: 1,
              bgcolor:
                fld.id === selectedId
                  ? theme.palette.action.selected
                  : "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={() => dispatch(selectField(fld.id))}
          >
            <Typography>
              {fld.label} — <small>({fld.type})</small>
            </Typography>
            <Box>
              <IconButton
                onClick={() =>
                  dispatch(moveField({ id: fld.id, direction: -1 }))
                }
                size="small"
              >
                <ArrowUpward fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch(moveField({ id: fld.id, direction: 1 }))
                }
                size="small"
              >
                <ArrowDownward fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => dispatch(removeField(fld.id))}
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ mt: 2 }}
          disabled={!fields.length}
        >
          Save Form
        </Button>
      </Box>

      {/* Right */}
      <Box flex={1}>
        {selected ? (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Configure Field</Typography>

            {/* Label */}
            <TextField
              label="Label"
              fullWidth
              value={selected.label}
              onChange={(e) =>
                dispatch(
                  updateField({
                    id: selected.id,
                    changes: { label: e.target.value },
                  })
                )
              }
              sx={{ mt: 2 }}
            />

            {/* Required toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={selected.required}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        id: selected.id,
                        changes: { required: e.target.checked },
                      })
                    )
                  }
                />
              }
              label="Required"
            />

            {/* Default value */}
            {/* <TextField
              label="Default Value"
              fullWidth
              value={selected.defaultValue}
              onChange={(e) =>
                dispatch(
                  updateField({
                    id: selected.id,
                    changes: { defaultValue: e.target.value },
                  })
                )
              }
              sx={{ mt: 2 }}
            /> */}

            {/* Options for select / radio / checkbox */}
            {["select", "radio", "checkbox"].includes(selected.type) && (
              <TextField
                label="Options (comma separated)"
                fullWidth
                value={selected.options.join(",")}
                onChange={(e) =>
                  dispatch(
                    updateField({
                      id: selected.id,
                      changes: {
                        options: e.target.value.split(",").map((o) => o.trim()),
                      },
                    })
                  )
                }
                sx={{ mt: 2 }}
              />
            )}

            {/* Validation switches */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Validation Rules
            </Typography>
            {[
              { key: "notEmpty", label: "Not Empty" },
              { key: "email", label: "Email Format" },
              { key: "password", label: "Custom Password Rule" },
            ].map(({ key, label }) => (
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    checked={(selected.validations as any)[key]}
                    onChange={(e) =>
                      dispatch(
                        updateField({
                          id: selected.id,
                          changes: {
                            validations: {
                              ...selected.validations,
                              [key]: e.target.checked,
                            },
                          },
                        })
                      )
                    }
                  />
                }
                label={label}
              />
            ))}

            {/* Min / Max length */}
            <TextField
              label="Min Length"
              type="number"
              fullWidth
              value={selected.validations.minLength ?? ""}
              onChange={(e) =>
                dispatch(
                  updateField({
                    id: selected.id,
                    changes: {
                      validations: {
                        ...selected.validations,
                        minLength: Number(e.target.value),
                      },
                    },
                  })
                )
              }
              sx={{ mt: 1 }}
            />
            <TextField
              label="Max Length"
              type="number"
              fullWidth
              value={selected.validations.maxLength ?? ""}
              onChange={(e) =>
                dispatch(
                  updateField({
                    id: selected.id,
                    changes: {
                      validations: {
                        ...selected.validations,
                        maxLength: Number(e.target.value),
                      },
                    },
                  })
                )
              }
              sx={{ mt: 1 }}
            />

            {/* Derived settings */}
            {selected.type === "derived" && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Derived Settings
                </Typography>

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Parent Fields</InputLabel>
                  <Select
                    multiple
                    value={selected.derivedParents}
                    label="Parent Fields"
                    onChange={(e) =>
                      dispatch(
                        updateField({
                          id: selected.id,
                          changes: {
                            derivedParents: e.target.value as string[],
                          },
                        })
                      )
                    }
                  >
                    {fields
                      .filter((f) => f.id !== selected.id)
                      .map((f) => (
                        <MenuItem key={f.id} value={f.id}>
                          {f.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Formula"
                  fullWidth
                  multiline
                  value={selected.derivedFormula}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        id: selected.id,
                        changes: { derivedFormula: e.target.value },
                      })
                    )
                  }
                  sx={{ mt: 1 }}
                />
              </>
            )}
          </Paper>
        ) : (
          <Typography>Select a field to configure…</Typography>
        )}
      </Box>
    </Box>
  );
}
