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
import { Controls } from "./Controls";

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
        {/* <ModalOverlay /> doesnt fill the screen */}
        <ModalContent maxWidth="95vw">
          <ModalHeader>Vision Trainer Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Controls />

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
