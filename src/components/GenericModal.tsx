import { Modal, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface GenericModalProps extends Omit<ModalProps, 'opened' | 'onClose'> {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function GenericModal({
  opened,
  onClose,
  title,
  children,
  ...modalProps
}: GenericModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered {...modalProps}>
      {children}
    </Modal>
  );
}
