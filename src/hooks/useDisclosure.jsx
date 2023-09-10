import { useState } from "react";

export function useDisclosure() {
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onToggle = () => setOpen((e) => !e);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
  };
}
