/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function SearchForm({ onSearch }: { onSearch: (p: { from: string; to: string; date: string }) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-display font-bold">Rechercher</h2>
        <p className="text-gray-500 mt-2 text-sm">Placeholder (focus: double connexion).</p>

        <button
          className="mt-6 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red transition-all"
          onClick={() => onSearch({ from: 'Ouagadougou', to: 'Bobo-Dioulasso', date: new Date().toISOString().slice(0, 10) })}
        >
          Démo recherche
        </button>
      </div>
    </div>
  );
}

