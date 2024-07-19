import { useContext as useContextOrig, useLayoutEffect, useReducer } from "react";

function useContextSelector(context, selector) {
  const contextValue = useContextOrig(context);
  const { value, listeners } = contextValue;

  const selected = selector(value);

  const [state, dispatch] = useReducer(
    (prev, action) => {
      const { v } = action;
      if (Object.is(prev[0], v)) {
        return prev;
      }
      const nextSelected = selector(v);
      if (Object.is(prev[1], nextSelected)) {
        return prev;
      }
      return [v, nextSelected];
    },
    [value, selected]
  );

  useLayoutEffect(() => {
    listeners.add(dispatch);
    return () => {
      listeners.delete(dispatch);
    };
  }, [listeners]);

  return selected;
}
