export function finalAnswerStream<T extends { type: string }>(
  getFinalText?: () => string | undefined,
) {
  let pending: T[] = [];
  let usedTool = false;
  const emit = (controller: TransformStreamDefaultController<T>) => {
    if (!usedTool) {
      const verified = getFinalText?.();
      let emitted = false;
      for (const item of pending) {
        if (verified !== undefined && item.type === "text-delta") {
          if (!emitted) controller.enqueue({ ...item, delta: verified });
          emitted = true;
        } else controller.enqueue(item);
      }
    }
    pending = [];
  };
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      if (chunk.type === "start-step") {
        pending = [];
        usedTool = false;
      }
      if (chunk.type.startsWith("tool-")) usedTool = true;
      if (["text-start", "text-delta", "text-end"].includes(chunk.type)) {
        pending.push(chunk);
        return;
      }
      if (
        chunk.type === "finish-step" ||
        chunk.type === "finish" ||
        chunk.type === "error"
      ) {
        emit(controller);
      }
      controller.enqueue(chunk);
    },
    flush(controller) {
      emit(controller);
    },
  });
}
