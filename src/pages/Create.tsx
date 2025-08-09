import {
  Box,
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
import { Info, Trash, ChevronUp, ChevronDown } from "lucide-react";

export default function CreateForm() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { fields, selectedId } = useAppSelector((s) => s.formBuilder);
  const selected = fields.find((f) => f.id === selectedId);

  const handleSave = () => {
    const name = window.prompt("Enter a name for this form schema:");
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(fields));
    alert(`Saved schema under key "${name}"`);
  };

  const SwitchData = [
    { key: "notEmpty", label: "Not Empty" },
    { key: "email", label: "Email Format" },
    { key: "password", label: "Custom Password Rule" },
  ];

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
        <div className="text-xl font-poppins mb-3">Add Fields</div>

        <FieldPalette onAddField={(t) => dispatch(addField(t))} />

        <div className="text-xl font-poppins mb-3">Fields</div>
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
                <ChevronUp fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch(moveField({ id: fld.id, direction: 1 }))
                }
                size="small"
              >
                <ChevronDown fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => dispatch(removeField(fld.id))}
                size="small"
              >
                <Trash fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}

        <button
          onClick={handleSave}
          disabled={!fields.length}
          className="bg-black hover:bg-stone-900/80 text-white border border-slate-400 hover:border-blue-300
                           rounded-lg px-3 py-2 text-sm font-medium hover:text-blue-200
                           transition-all duration-200 ease-out
                           hover:shadow-md active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
        >
          Save Form
        </button>
      </Box>

      {/* Right */}
      <Box
        flex={1}
        sx={{
          "& .MuiInputLabel-root": {
            fontFamily: "Poppins, sans-serif",
          },
          "& .MuiInputBase-input": {
            fontFamily: "Poppins, sans-serif",
          },
        }}
      >
        {selected ? (
          <Paper sx={{ p: 2, backgroundColor: "#f4f4f4" }}>
            <span className="text-xl font-poppins font-semibold">
              Configure Field
            </span>

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
            <div className="text-md font-poppins mt-2">Validation Rules</div>
            {SwitchData.map(({ key, label }) => (
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
                <div className="text-md font-poppins mt-2 mb-1">
                  Derived Settings
                </div>
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
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white/70 px-4 py-3 text-sm text-gray-700 shadow-sm">
            <Info />
            <span className="font-medium">Select a field to configure…</span>
          </div>
        )}
      </Box>
    </Box>
  );
}
