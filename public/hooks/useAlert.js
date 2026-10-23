import { use } from 'react';
import AlertContext from '../contexts/AlertContext';

const useAlert = () => use(AlertContext);

export default useAlert;
