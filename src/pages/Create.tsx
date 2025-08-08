// import { useState } from 'react';
// import {
//   Box,
//   Button,
//   Paper,
//   Typography,
//   TextField,
//   Switch,
//   FormControlLabel,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Grid,
// } from '@mui/material';
// import {
//   Delete as DeleteIcon,
//   ArrowUpward,
//   ArrowDownward,
//   Save as SaveIcon, // ✅ FIX: Import SaveIcon
// } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';

// type FieldType =
//   | 'text'
//   | 'number'
//   | 'textarea'
//   | 'select'
//   | 'radio'
//   | 'checkbox'
//   | 'date'
//   | 'derived';

// interface ValidationRules {
//   notEmpty: boolean;
//   minLength?: number;
//   maxLength?: number;
//   email: boolean;
//   password: boolean;
// }

// interface Field {
//   id: string;
//   type: FieldType;
//   label: string;
//   required: boolean;
//   defaultValue: string;
//   validations: ValidationRules;
//   derivedParents: string[];
//   derivedFormula: string;
// }

// export default function CreateForm() {
//   const theme = useTheme();
//   const [fields, setFields] = useState<Field[]>([]);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [saveDialogOpen, setSaveDialogOpen] = useState(false);
//   const [formName, setFormName] = useState('');

//   const addField = (type: FieldType) => {
//     const id = Date.now().toString();
//     setFields((f) => [
//       ...f,
//       {
//         id,
//         type,
//         label: type.toUpperCase(),
//         required: false,
//         defaultValue: '',
//         validations: { notEmpty: false, email: false, password: false },
//         derivedParents: [],
//         derivedFormula: '',
//       },
//     ]);
//     setSelectedId(id);
//   };

//   const updateField = (id: string, changes: Partial<Field>) =>
//     setFields((f) =>
//       f.map((fld) => (fld.id === id ? { ...fld, ...changes } : fld))
//     );

//   const removeField = (id: string) =>
//     setFields((f) => f.filter((fld) => fld.id !== id));

//   const moveField = (id: string, direction: -1 | 1) =>
//     setFields((f) => {
//       const idx = f.findIndex((fld) => fld.id === id);
//       if (idx < 0) return f;
//       const swapIdx = idx + direction;
//       if (swapIdx < 0 || swapIdx >= f.length) return f;
//       const newArr = [...f];
//       [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
//       return newArr;
//     });

//   const saveSchema = () => {
//     localStorage.setItem(formName, JSON.stringify(fields));
//     setSaveDialogOpen(false);
//   };

//   const selected = fields.find((f) => f.id === selectedId);

//   return (
//     <Box
//       sx={{
//         p: 2,
//         display: 'flex',
//         flexDirection: { xs: 'column', md: 'row' },
//         gap: 2,
//       }}
//     >
//       {/* Left: field palette + list */}
//       <Box flex={1}>
//         <Typography variant="h6" gutterBottom>
//           Add Field
//         </Typography>
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           {(
//             [
//               'text',
//               'number',
//               'textarea',
//               'select',
//               'radio',
//               'checkbox',
//               'date',
//               'derived',
//             ] as FieldType[]
//           ).map((type) => (
//             <Grid item xs={6} sm={3} key={type}>
//               {/* ✅ FIX: Changed div to Grid item */}
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => addField(type)}
//               >
//                 {type}
//               </Button>
//             </Grid>
//           ))}
//         </Grid>

//         <Typography variant="h6" gutterBottom>
//           Fields
//         </Typography>
//         {fields.map((fld) => (
//           <Paper
//             key={fld.id}
//             sx={{
//               p: 1,
//               mb: 1,
//               bgcolor:
//                 fld.id === selectedId
//                   ? theme.palette.action.selected
//                   : 'inherit',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//             onClick={() => setSelectedId(fld.id)}
//           >
//             <Typography>
//               {fld.label} — <small>({fld.type})</small>
//             </Typography>
//             <Box>
//               <IconButton onClick={() => moveField(fld.id, -1)} size="small">
//                 <ArrowUpward fontSize="small" />
//               </IconButton>
//               <IconButton onClick={() => moveField(fld.id, 1)} size="small">
//                 <ArrowDownward fontSize="small" />
//               </IconButton>
//               <IconButton onClick={() => removeField(fld.id)} size="small">
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           </Paper>
//         ))}

//         <Button
//           variant="contained"
//           startIcon={<SaveIcon />}
//           onClick={() => setSaveDialogOpen(true)}
//           sx={{ mt: 2 }}
//           disabled={!fields.length}
//         >
//           Save Form
//         </Button>
//       </Box>

//       {/* Right: configuration panel */}
//       <Box flex={1}>
//         {selected ? (
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6">Configure Field</Typography>
//             <TextField
//               label="Label"
//               fullWidth
//               value={selected.label}
//               onChange={(e) =>
//                 updateField(selected.id, { label: e.target.value })
//               }
//               sx={{ mt: 2 }}
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={selected.required}
//                   onChange={(e) =>
//                     updateField(selected.id, { required: e.target.checked })
//                   }
//                 />
//               }
//               label="Required"
//             />
//             <TextField
//               label="Default Value"
//               fullWidth
//               value={selected.defaultValue}
//               onChange={(e) =>
//                 updateField(selected.id, { defaultValue: e.target.value })
//               }
//               sx={{ mt: 2 }}
//             />

//             <Typography variant="subtitle1" sx={{ mt: 2 }}>
//               Validation Rules
//             </Typography>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={selected.validations.notEmpty}
//                   onChange={(e) =>
//                     updateField(selected.id, {
//                       validations: {
//                         ...selected.validations,
//                         notEmpty: e.target.checked,
//                       },
//                     })
//                   }
//                 />
//               }
//               label="Not Empty"
//             />
//             <TextField
//               label="Min Length"
//               type="number"
//               fullWidth
//               value={selected.validations.minLength ?? ''}
//               onChange={(e) =>
//                 updateField(selected.id, {
//                   validations: {
//                     ...selected.validations,
//                     minLength: Number(e.target.value),
//                   },
//                 })
//               }
//               sx={{ mt: 1 }}
//             />
//             <TextField
//               label="Max Length"
//               type="number"
//               fullWidth
//               value={selected.validations.maxLength ?? ''}
//               onChange={(e) =>
//                 updateField(selected.id, {
//                   validations: {
//                     ...selected.validations,
//                     maxLength: Number(e.target.value),
//                   },
//                 })
//               }
//               sx={{ mt: 1 }}
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={selected.validations.email}
//                   onChange={(e) =>
//                     updateField(selected.id, {
//                       validations: {
//                         ...selected.validations,
//                         email: e.target.checked,
//                       },
//                     })
//                   }
//                 />
//               }
//               label="Email Format"
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={selected.validations.password}
//                   onChange={(e) =>
//                     updateField(selected.id, {
//                       validations: {
//                         ...selected.validations,
//                         password: e.target.checked,
//                       },
//                     })
//                   }
//                 />
//               }
//               label="Custom Password Rule"
//             />

//             {selected.type === 'derived' && (
//               <>
//                 <Typography variant="subtitle1" sx={{ mt: 2 }}>
//                   Derived Settings
//                 </Typography>
//                 <FormControl fullWidth sx={{ mt: 1 }}>
//                   <InputLabel>Parent Fields</InputLabel>
//                   <Select
//                     multiple
//                     value={selected.derivedParents}
//                     label="Parent Fields"
//                     onChange={(e) =>
//                       updateField(selected.id, {
//                         derivedParents: e.target.value as string[],
//                       })
//                     }
//                   >
//                     {fields
//                       .filter((f) => f.id !== selected.id)
//                       .map((f) => (
//                         <MenuItem key={f.id} value={f.id}>
//                           {f.label}
//                         </MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//                 <TextField
//                   label="Formula"
//                   fullWidth
//                   multiline
//                   value={selected.derivedFormula}
//                   onChange={(e) =>
//                     updateField(selected.id, {
//                       derivedFormula: e.target.value,
//                     })
//                   }
//                   sx={{ mt: 1 }}
//                 />
//               </>
//             )}
//           </Paper>
//         ) : (
//           <Typography>Select a field to configure…</Typography>
//         )}
//       </Box>

//       {/* Save dialog */}
//       <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
//         <DialogTitle>Save Form Schema</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Form Name"
//             fullWidth
//             value={formName}
//             onChange={(e) => setFormName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
//           <Button onClick={saveSchema} disabled={!formName}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }


import { useState } from 'react';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FieldPalette from '../components/FieldPalette';
import type { FieldType } from '../components/FieldPalette';
// import FieldPalette, type { FieldType } from '../co/mponents/FieldPalette';

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

export default function CreateForm() {
  const theme = useTheme();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addField = (type: FieldType) => {
    const id = Date.now().toString();
    setFields((f) => [
      ...f,
      {
        id,
        type,
        label: type.toUpperCase(),
        required: false,
        defaultValue: '',
        validations: { notEmpty: false, email: false, password: false },
        derivedParents: [],
        derivedFormula: '',
      },
    ]);
    setSelectedId(id);
  };

  const updateField = (id: string, changes: Partial<Field>) =>
    setFields((f) =>
      f.map((fld) => (fld.id === id ? { ...fld, ...changes } : fld))
    );

  const removeField = (id: string) =>
    setFields((f) => f.filter((fld) => fld.id !== id));

  const moveField = (id: string, direction: -1 | 1) =>
    setFields((f) => {
      const idx = f.findIndex((fld) => fld.id === id);
      if (idx < 0) return f;
      const swapIdx = idx + direction;
      if (swapIdx < 0 || swapIdx >= f.length) return f;
      const newArr = [...f];
      [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
      return newArr;
    });

  const handleSave = () => {
    const name = window.prompt('Enter a name for this form schema:');
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(fields));
    alert(`Saved schema under key "${name}"`);
  };

  const selected = fields.find((f) => f.id === selectedId);

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
      }}
    >
      {/* Left panel: palette + field list */}
      <Box flex={1}>
        <Typography variant="h6" gutterBottom>
          Add Field
        </Typography>
        <FieldPalette onAddField={addField} />

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
                  : 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={() => setSelectedId(fld.id)}
          >
            <Typography>
              {fld.label} — <small>({fld.type})</small>
            </Typography>
            <Box>
              <IconButton onClick={() => moveField(fld.id, -1)} size="small">
                <ArrowUpward fontSize="small" />
              </IconButton>
              <IconButton onClick={() => moveField(fld.id, 1)} size="small">
                <ArrowDownward fontSize="small" />
              </IconButton>
              <IconButton onClick={() => removeField(fld.id)} size="small">
                <DeleteIcon fontSize="small" />
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

      {/* Right panel: configure selected field */}
      <Box flex={1}>
        {selected ? (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Configure Field</Typography>
            <TextField
              label="Label"
              fullWidth
              value={selected.label}
              onChange={(e) =>
                updateField(selected.id, { label: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selected.required}
                  onChange={(e) =>
                    updateField(selected.id, { required: e.target.checked })
                  }
                />
              }
              label="Required"
            />
            <TextField
              label="Default Value"
              fullWidth
              value={selected.defaultValue}
              onChange={(e) =>
                updateField(selected.id, { defaultValue: e.target.value })
              }
              sx={{ mt: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Validation Rules
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={selected.validations.notEmpty}
                  onChange={(e) =>
                    updateField(selected.id, {
                      validations: {
                        ...selected.validations,
                        notEmpty: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Not Empty"
            />
            <TextField
              label="Min Length"
              type="number"
              fullWidth
              value={selected.validations.minLength ?? ''}
              onChange={(e) =>
                updateField(selected.id, {
                  validations: {
                    ...selected.validations,
                    minLength: Number(e.target.value),
                  },
                })
              }
              sx={{ mt: 1 }}
            />
            <TextField
              label="Max Length"
              type="number"
              fullWidth
              value={selected.validations.maxLength ?? ''}
              onChange={(e) =>
                updateField(selected.id, {
                  validations: {
                    ...selected.validations,
                    maxLength: Number(e.target.value),
                  },
                })
              }
              sx={{ mt: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selected.validations.email}
                  onChange={(e) =>
                    updateField(selected.id, {
                      validations: {
                        ...selected.validations,
                        email: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Email Format"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selected.validations.password}
                  onChange={(e) =>
                    updateField(selected.id, {
                      validations: {
                        ...selected.validations,
                        password: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Custom Password Rule"
            />

            {selected.type === 'derived' && (
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
                      updateField(selected.id, {
                        derivedParents: e.target.value as string[],
                      })
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
                    updateField(selected.id, {
                      derivedFormula: e.target.value,
                    })
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