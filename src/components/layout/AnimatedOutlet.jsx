import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Page wrapper with an enter-only fade.
 *
 * The previous `<AnimatePresence mode="wait">` around `<Outlet />` kept the old
 * <main> mounted during its exit animation while its Outlet already rendered the
 * NEW route. The incoming page then waited on an exit that could stall, so pages
 * like My profile showed up blank until a full refresh. Remounting on `routeKey`
 * with an enter animation only means the new page renders immediately.
 */
export default function AnimatedOutlet({ routeKey, className }) {
  return (
    <motion.main key={routeKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={className}>
      <Outlet />
    </motion.main>
  );
}
