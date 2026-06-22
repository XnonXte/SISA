import { useDispatch, useSelector } from 'react-redux';
import { navigate, goBack, resetNavigation } from '../features/navigation/navigationSlice';

/**
 * Drop-in replacement for the old `const [screen, setScreen] = useState('splash')`
 * + `go(s)` pattern from App.jsx, now backed by Redux.
 *
 * Usage in a screen:
 *   const { go, back } = useAppNavigation();
 *   go('dashboard');   // same call signature as before
 *   back();            // pops to the previous screen automatically
 */
export function useAppNavigation() {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.navigation.current);

  return {
    current,
    go: (screen) => dispatch(navigate(screen)),
    back: () => dispatch(goBack()),
    reset: () => dispatch(resetNavigation()),
  };
}
