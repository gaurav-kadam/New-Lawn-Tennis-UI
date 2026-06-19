import React,
{
  createContext,
  useContext,
  useState,
} from 'react';

import LoaderService
from '../services/loader/loader.service';

interface LoaderContextType {

  loading: boolean;

  showLoader: () => void;

  hideLoader: () => void;
}

const LoaderContext =
  createContext<LoaderContextType>(
    {} as LoaderContextType
  );

export const LoaderProvider = ({
  children,
}: any) => {

  const [loading, setLoading] =
    useState(false);

  // ================= SHOW =================

  const showLoader = () => {

    setLoading(true);
  };

  // ================= HIDE =================

  const hideLoader = () => {

    setLoading(false);
  };

  // ================= REGISTER SERVICE =================

  LoaderService.register(
    showLoader,
    hideLoader
  );

  return (

    <LoaderContext.Provider
      value={{
        loading,

        showLoader,
        hideLoader,
      }}
    >

      {children}

    </LoaderContext.Provider>
  );
};

export const useLoader = () =>
  useContext(LoaderContext);