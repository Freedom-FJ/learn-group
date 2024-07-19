/*
 * @Author: mjh
 * @Date: 2024-07-19 10:42:51
 * @LastEditors: mjh
 * @LastEditTime: 2024-07-19 10:43:01
 * @Description: 
 */
import { createContext as createContextOrig, useLayoutEffect, useRef } from "react";

const createProvider = (ProviderOrig) => {
  const ContextProvider = ({ value, children }) => {
    const contextValue = useRef();
    if (!contextValue.current) {
      const listeners = new Set();
      contextValue.current = {
        value,
        listeners,
      };
    }
    useLayoutEffect(() => {
      contextValue.current.value = value;
      contextValue.current.listeners.forEach((listener) => {
        listener({ v: value });
      });
    }, [value]);
    return <ProviderOrig value={contextValue.current}>{children}</ProviderOrig>;
  };

  return ContextProvider;
};

function createContext(defaultValue) {
  const context = createContextOrig({
    value: defaultValue,
    listeners: new Set(),
  });
  context.Provider = createProvider(context.Provider);
  delete context.Consumer;
  return context;
}
