// import React, { useState, useEffect, Fragment } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Checkbox,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormHelperText,
//   FormLabel,
// } from "@mui/material";
// import { useNavigate, Navigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { closeForm, type Field } from "../store/slices/previewSlice";
// import {ArrowLeft,ChevronDown} from 'lucide-react'

// export default function Preview() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { activeForm, fields } = useAppSelector((s) => s.preview);

//   const [values, setValues] = useState<Record<string, any>>({});
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const init: Record<string, any> = {};
//     fields.forEach((f) => {
//       if (f.type === "checkbox" && (f.options?.length ?? 0) > 0) init[f.id] = [];
//       else if (f.type === "checkbox") init[f.id] = false;
//       else init[f.id] = f.defaultValue ?? "";
//     });
//     setValues(init);
//     setErrors({});
//   }, [fields]);

//   /* -- helpers -------------------------------------------------------------- */
//   const handleChange = (id: string, val: any) => {
//     setValues((prev) => {
//       const next = { ...prev, [id]: val };

//       /* recompute derived fields */
//       fields
//         .filter((f) => f.type === "derived")
//         .forEach((f) => {
//           try {
//             // eslint-disable-next-line no-new-func
//             const fn = new Function("values", `return ${f.derivedFormula}`);
//             next[f.id] = fn(next);
//           } catch {
//             next[f.id] = "";
//           }
//         });

//       return next;
//     });
//   };

//   const toggleOption = (fid: string, opt: string) => {
//     const current: string[] = values[fid] || [];
//     const newArr = current.includes(opt)
//       ? current.filter((o) => o !== opt)
//       : [...current, opt];
//     handleChange(fid, newArr);
//   };

//   const validateField = (f: Field): string => {
//     const v = values[f.id];
//     const toStr = Array.isArray(v) ? v.join(",") : `${v || ""}`.trim();

//     if (f.required && f.validations.notEmpty) {
//       if (Array.isArray(v) ? v.length === 0 : !toStr) return "Required";
//     }
//     if (f.validations.minLength && toStr.length < f.validations.minLength)
//       return `Min ${f.validations.minLength} chars`;
//     if (f.validations.maxLength && toStr.length > f.validations.maxLength)
//       return `Max ${f.validations.maxLength} chars`;
//     if (f.validations.email && !/^\S+@\S+\.\S+$/.test(toStr))
//       return "Invalid email";
//     if (f.validations.password && !/(?=.*\d).{8,}/.test(toStr))
//       return "Password needs 8+ chars & a number";
//     return "";
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const errs: Record<string, string> = {};
//     fields.forEach((f) => {
//       const err = validateField(f);
//       if (err) errs[f.id] = err;
//     });
//     setErrors(errs);
//     if (!Object.keys(errs).length) alert("✅ All inputs are valid!");
//   };

//   const handleBack = () => {
//     dispatch(closeForm());
//     navigate("/my-forms");
//   };

//   if (!activeForm) return <Navigate to="/my-forms" />;
//   const baseInput =
//   "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

//   return (
//     <Box p={6}>
//       <Button onClick={handleBack} sx={{ mb: 2 }}>
//         ← Back to forms
//       </Button>

//       <Typography variant="h5" gutterBottom>
//         Preview: {activeForm}
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         {fields.map((f) => {
//           const err = errors[f.id];
//           const opts =
//             f.options?.length && f.options.length > 0
//               ? f.options
//               : (f.defaultValue || "")
//                   .split(",")
//                   .map((o) => o.trim())
//                   .filter(Boolean);

//           switch (f.type) {
//             case "text":
//             case "number":
//             case "date":
//               return (
//                 <TextField
//                   key={f.id}
//                   type={f.type}
//                   label={f.label}
//                   value={values[f.id] || ""}
//                   onChange={(e) => handleChange(f.id, e.target.value)}
//                   fullWidth
//                   margin="normal"
//                   error={!!err}
//                   helperText={err}
//                 />
//               );

//             case "textarea":
//               return (
//                 <TextField
//                   key={f.id}
//                   label={f.label}
//                   value={values[f.id] || ""}
//                   onChange={(e) => handleChange(f.id, e.target.value)}
//                   fullWidth
//                   multiline
//                   rows={4}
//                   margin="normal"
//                   error={!!err}
//                   helperText={err}
//                 />
//               );

//             case "select":
//               return (
//                 <TextField
//                   key={f.id}
//                   select
//                   label={f.label}
//                   value={values[f.id] || ""}
//                   onChange={(e) => handleChange(f.id, e.target.value)}
//                   fullWidth
//                   margin="normal"
//                   error={!!err}
//                   helperText={err}
//                 >
//                   {opts.map((o) => (
//                     <MenuItem key={o} value={o}>
//                       {o}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               );

//             case "radio":
//               return (
//                 <FormControl
//                   key={f.id}
//                   component="fieldset"
//                   margin="normal"
//                   error={!!err}
//                 >
//                   <FormLabel>{f.label}</FormLabel>
//                   <RadioGroup
//                     value={values[f.id] || ""}
//                     onChange={(e) => handleChange(f.id, e.target.value)}
//                   >
//                     {opts.map((o) => (
//                       <FormControlLabel
//                         key={o}
//                         value={o}
//                         control={<Radio />}
//                         label={o}
//                       />
//                     ))}
//                   </RadioGroup>
//                   <FormHelperText>{err}</FormHelperText>
//                 </FormControl>
//               );

//             case "checkbox":
//               if (opts.length > 0) {
//                 return (
//                   <Fragment key={f.id}>
//                     <FormLabel sx={{ mt: 2 }}>{f.label}</FormLabel>
//                     {opts.map((o) => (
//                       <FormControlLabel
//                         key={o}
//                         control={
//                           <Checkbox
//                             checked={(values[f.id] || []).includes(o)}
//                             onChange={() => toggleOption(f.id, o)}
//                           />
//                         }
//                         label={o}
//                       />
//                     ))}
//                     {err && (
//                       <Typography color="error" variant="caption">
//                         {err}
//                       </Typography>
//                     )}
//                   </Fragment>
//                 );
//               }
//               return (
//                 <FormControlLabel
//                   key={f.id}
//                   control={
//                     <Checkbox
//                       checked={!!values[f.id]}
//                       onChange={(e) =>
//                         handleChange(f.id, e.target.checked)
//                       }
//                     />
//                   }
//                   label={f.label}
//                 />
//               );

//             case "derived":
//               return (
//                 <TextField
//                   key={f.id}
//                   label={f.label}
//                   value={values[f.id] || ""}
//                   fullWidth
//                   margin="normal"
//                   InputProps={{ readOnly: true }}
//                 />
//               );

//             default:
//               return null;
//           }
//         })}

//         <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//           Submit
//         </Button>
//       </form>
//     </Box>

//   );
// }

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { closeForm, type Field } from "../store/slices/previewSlice";

export default function Preview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeForm, fields } = useAppSelector((s) => s.preview);

  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "checkbox" && (f.options?.length ?? 0) > 0)
        init[f.id] = [];
      else if (f.type === "checkbox") init[f.id] = false;
      else init[f.id] = f.defaultValue ?? "";
    });
    setValues(init);
    setErrors({});
  }, [fields]);

  const handleChange = (id: string, val: any) => {
    setValues((prev) => {
      const next = { ...prev, [id]: val };

      /* recompute derived fields */
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

    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

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

    if (f.required && f.validations?.notEmpty) {
      if (Array.isArray(v) ? v.length === 0 : !toStr) return "Required";
    }
    if (f.validations?.minLength && toStr.length < f.validations.minLength)
      return `Min ${f.validations.minLength} chars`;
    if (f.validations?.maxLength && toStr.length > f.validations.maxLength)
      return `Max ${f.validations.maxLength} chars`;
    if (f.validations?.email && !/^\S+@\S+\.\S+$/.test(toStr))
      return "Invalid email";
    if (f.validations?.password && !/(?=.*\d).{8,}/.test(toStr))
      return "Password needs 8+ chars & a number";
    return "";
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      const err = validateField(f);
      if (err) errs[f.id] = err;
    });
    setErrors(errs);

    if (!Object.keys(errs).length) {
      alert("All inputs are valid!");
      console.log("Form values:", values);
    }
  };

  const handleBack = () => {
    dispatch(closeForm());
    navigate("/my-forms");
  };

  if (!activeForm) return <Navigate to="/my-forms" />;

  // renderer
  const baseInput =
    "w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  const renderField = (field: Field) => {
    const err = errors[field.id];
    const opts =
      field.options?.length && field.options.length > 0
        ? field.options
        : (field.defaultValue || "")
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean);

    const labelCls = `block text-sm font-medium mb-2 ${
      err ? "text-red-700" : "text-gray-700"
    }`;
    const inputCls = `${baseInput} ${
      err
        ? "border-red-500 bg-red-50"
        : "border-gray-300 bg-white hover:border-gray-400"
    }`;

    switch (field.type) {
      // text / number / date
      case "text":
      case "number":
      case "date":
        return (
          <div key={field.id} className="mb-6">
            <label className={labelCls}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={
                field.type === "text" && field.validations?.password
                  ? "password"
                  : field.type
              }
              value={values[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={inputCls}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </div>
        );

      // textarea
      case "textarea":
        return (
          <div key={field.id} className="mb-6">
            <label className={labelCls}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              rows={4}
              value={values[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`${inputCls} resize-none`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {field.validations?.maxLength && (
              <p className="mt-1 text-xs text-gray-500">
                {(values[field.id] || "").length}/{field.validations.maxLength}{" "}
                characters
              </p>
            )}
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </div>
        );

      // select
      case "select":
        return (
          <div key={field.id} className="mb-6">
            <label className={labelCls}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <select
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={`${inputCls} appearance-none pr-10`}
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </div>
        );

      // radio
      case "radio":
        return (
          <div key={field.id} className="mb-6">
            <label className={labelCls}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-3">
              {opts.map((o) => (
                <label
                  key={o}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={o}
                    checked={values[field.id] === o}
                    onChange={() => handleChange(field.id, o)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                    {o}
                  </span>
                </label>
              ))}
            </div>
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </div>
        );

      // checkbox
      case "checkbox":
        /* multi-option list */
        if (opts.length > 0) {
          return (
            <div key={field.id} className="mb-6">
              <label className={labelCls}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-3">
                {opts.map((o) => (
                  <label
                    key={o}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={(values[field.id] || []).includes(o)}
                      onChange={() => toggleOption(field.id, o)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                      {o}
                    </span>
                  </label>
                ))}
              </div>
              {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
            </div>
          );
        }
        /* single checkbox */
        return (
          <div key={field.id} className="mb-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={!!values[field.id]}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                {field.label}
              </span>
            </label>
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          </div>
        );

      // derived 
      case "derived":
        return (
          <div key={field.id} className="mb-6">
            <label className={labelCls}>{field.label}</label>
            <input
              type="text"
              value={values[field.id] || ""}
              readOnly
              className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-600`}
            />
            <p className="mt-1 text-xs text-gray-500">
              This field is automatically calculated
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-y-auto">
      <div className="absolute pl-5 pt-5">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to forms
        </button>
      </div>
      <div className="w-full max-w-3xl mx-auto px-2 md:px-1 my-5">
        <div className="bg-[#f4f4f4] rounded-xl shadow-lg border border-gray-200">
          {/* form header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-amber-50 rounded-t-xl">
            <h2 className="text-3xl font-light text-gray-900 font-poppins">
              Preview: {activeForm}
            </h2>
          </div>

          {/* form content */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fields.map((f) => (
                <div
                  key={f.id}
                  className={
                    f.type === "textarea" || f.type === "derived"
                      ? "lg:col-span-2"
                      : ""
                  }
                >
                  {renderField(f)}
                </div>
              ))}
            </div>

            {/* buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const init: Record<string, any> = {};
                    fields.forEach((f) => {
                      if (f.type === "checkbox" && (f.options?.length ?? 0) > 0)
                        init[f.id] = [];
                      else if (f.type === "checkbox") init[f.id] = false;
                      else init[f.id] = f.defaultValue ?? "";
                    });
                    setValues(init);
                    setErrors({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Clear Form
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-stone-900/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Submit Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* validation summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Validation Errors
            </h3>
            <ul className="space-y-2">
              {Object.entries(errors).map(([fid, msg]) => {
                const field = fields.find((f) => f.id === fid);
                return (
                  <li key={fid} className="text-sm text-red-700">
                    <strong>{field?.label || fid}:</strong> {msg}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* data preview */}
        {Object.keys(values).some(
          (k) =>
            values[k] &&
            values[k] !== "" &&
            (!Array.isArray(values[k]) || values[k].length > 0)
        ) && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Form Data Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-700">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
