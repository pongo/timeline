import { ref, onUnmounted } from "vue";
import {
  deleteActiveBlocks,
  getMinutesBetweenDates,
  toggleStopwatch,
  updateActiveBlock,
} from "./core.js";

export function useStopwatch(updateDuration, updateBlocks) {
  const _clearId = ref(0);
  const _startDate = ref(null);

  onUnmounted(() => clearInterval(_clearId.value));

  return { toggle };

  function toggle(_blocks) {
    const { started, startDate, blocks } = toggleStopwatch(
      new Date(),
      _startDate
    );

    if (started) {
      _startDate.value = startDate;
      _clearId.value = setInterval(() => {
        const duration = getMinutesBetweenDates(_startDate, new Date());
        updateDuration(duration);
        if (duration < 1) updateBlocks(updateActiveBlock(_blocks));
      }, 60_000);
      _blocks.push(...blocks);
      return _blocks;
    }

    clearInterval(_clearId.value);
    updateDuration(null);
    _startDate.value = null;
    _clearId.value = null;
    _blocks = deleteActiveBlocks(_blocks);
    if (blocks.length > 0) _blocks.push(...blocks);
    return _blocks;
  }
}
