"use client";

import { useRouter } from "next/navigation";
import useConverstation from "../../../hooks/useConversation";
import { useCallback, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "../../../components/Modal";
import { Dialog } from "@headlessui/react";
import Button from "../../../components/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConfirmationModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { conversationId } = useConverstation();
  const onDelete = useCallback(() => {
    setLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [conversationId, router, onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center
           rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation? This action
              cannot be undone
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button onClick={onDelete} danger disabled={loading}>
          Delete
        </Button>
        <Button onClick={onClose} secondary disabled={loading}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
