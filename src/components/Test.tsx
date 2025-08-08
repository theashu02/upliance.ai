import { useDispatch, useSelector } from "react-redux"
import { clearName, setName } from "../store/slices/userSlice";
import type { RootState } from "../store/store";

export default function Test() {
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.name.value);

  console.log(name);

  return (
    <>
      <input value={name} onChange={(e) => dispatch(setName(e.target.value))}/>
      <button onClick={() => dispatch(clearName())}>clear</button>
    </>
  )
}
