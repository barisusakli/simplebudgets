import { use } from 'react';
import UserContext from '../contexts/UserContext';

const useUser = () => use(UserContext);

export default useUser;
