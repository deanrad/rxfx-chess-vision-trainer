import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { historyModal } from "@src/services/historyModal";
import { HistoryModal } from "./HistoryModal";

export function OptionsModal() {
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={true}
        onClose={() => {
          historyModal.cancelCurrent();
        }}
      >
        <ModalOverlay />
        <ModalContent maxWidth="95vw">
          <ModalHeader>Vision Trainer Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HistoryModal />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => historyModal.cancelCurrent()}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
