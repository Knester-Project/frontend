import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from '@tanstack/react-router';

// Stores
import { useInstallStore } from "@/stores/install.store";

// Icons
import { CloseCircle, ImportCurve } from "iconsax-reactjs";

export default function InstallBtn() {

  const [showButton, setShowButton] = useState<boolean>(false);
  const { isInstalled } = useInstallStore();
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user previously closed the button
    const isClosed = localStorage.getItem("installationClosed")
    if (!isClosed && !isInstalled) {
      setShowButton(true)
    }
  }, [isInstalled])

  const handleClose = () => {
    setShowButton(false)
    localStorage.setItem("installationClosed", "true")
  }

  const handleInstallClick = () => {
    navigate({ to: "/install" })
  }

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div key="install-fab" className="right-6 bottom-6 z-[9] fixed flex flex-col gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
          {/* Draggable Floating Button */}
          <motion.button drag dragMomentum={false} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleInstallClick} className="flex justify-center items-center bg-primary shadow-lg p-2 rounded-full text-primary-foreground cursor-pointer" style={{ touchAction: "none" }}>
            <ImportCurve className="size-5" />
          </motion.button>

          {/* Close Button */}
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleClose} className="bg-destructive shadow-md mx-auto p-1 rounded-full w-fit text-destructive-foreground cursor-pointer">
            <CloseCircle className="size-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
