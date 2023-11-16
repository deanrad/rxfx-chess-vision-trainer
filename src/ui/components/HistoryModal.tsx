import { historyModal } from "@src/services/historyModal";
import { timeLogService } from "@src/services/timeLog";

export function HistoryModal() {
  return (
    <div className="history-modal">
      <h2>History</h2>
      <p>TODO make pretty</p>
      <ol>
        {timeLogService.state.value.map((log) => (
          <li>{JSON.stringify(log)}</li>
        ))}
      </ol>
      <button
        onClick={() => {
          historyModal.cancelCurrent();
        }}
      >
        Close
      </button>
    </div>
  );
}
