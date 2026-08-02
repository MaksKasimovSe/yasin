'use client';

export default function ClearHistoryButton({ action }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Вы уверены что хотите очистить историю? Действие нельзя будет отменить.')) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn ghost sm">
        Очистить историю
      </button>
    </form>
  );
}
