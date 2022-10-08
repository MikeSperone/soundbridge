import { createContext } from 'preact';
const Solo = createContext({
    solo: false,
    setSolo: () => {},
    isPerformer: false,
    setIsPerformer: () => {},
});

export default Solo;
