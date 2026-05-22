/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function PaymentModal({
  amount,
  onClose,
  onSuccess,
}: {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 border border-gray-100">
        <div className="text-2xl font-display font-black">Paiement</div>
        <div className="text-gray-500 mt-2">Montant: {amount}</div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-gray-100 font-bold">Annuler</button>
          <button
            onClick={onSuccess}
            className="flex-1 py-3 rounded-2xl bg-brand-red text-white font-bold"
          >
            Valider (démo)
          </button>
        </div>
      </div>
    </div>
  );
}

