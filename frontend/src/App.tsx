import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import './App.css'
import type { FilesStructure, InfoMod } from '../../src/shared/types'
import mods from '../../out/filesStructure.json'
import { startCase, capitalize } from 'es-toolkit'

function App() {
  const [type, setType] = useState('song');
  const [modsData, setModsData] = useState(mods as FilesStructure);
  const [filteredMods, setFilteredMods] = useState(modsData);
  const [orderBy, setOrderBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [orderDirection, setOrderDirection] = useState(1);

  useDebounce(() => 
    setDebounceSearchTerm(searchTerm.trim()), 
    1000,
    [searchTerm]);
    

  useEffect(() => {
    if (debounceSearchTerm !== '') {
      const aux = modsData[type as keyof FilesStructure].filter((mod) => {
        const lowerDebounceSearchTerm = debounceSearchTerm.toLowerCase();
        const keysToCheck = ['name', 'title', 'artist', 'year', 'category', 'path'];
        const match = keysToCheck.some((key) =>
          key in mod && String((mod as any)[key]).toLowerCase().includes(lowerDebounceSearchTerm)
        );
        return match;
      });
      setFilteredMods({ ...modsData, [type]: aux });
    }
    else {
      setFilteredMods(modsData);
    }
    
  }, [debounceSearchTerm]);

  const modTypes = ['song', 'category', 'venue', 'character', 'instrument'];
  const songAttributes = ['title', 'artist', 'year', 'category']

  const setOrder = (field: string) => {
    setOrderBy(field);
    (filteredMods[type as keyof FilesStructure] as InfoMod[]).sort((a, b) => {
      const aValue = (a as any)[field] || '';
      const bValue = (b as any)[field] || '';
      if (aValue < bValue) return -1 * orderDirection;
      if (aValue > bValue) return orderDirection;
      return 0;
    });
    setFilteredMods({ ...filteredMods });
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">GHWTDE Mod Explorer</h1>
      <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-px">
        {modTypes.map((modType) => (
          <button
            key={modType}
            onClick={() => setType(modType)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              type === modType
                ? 'border-orange-500 text-orange-500 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {capitalize(modType)}
          </button>
        ))}
      </div>
      <input 
        type='text' 
        placeholder='Search for mods...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}/>
      <div>
        <h3>Order by:</h3>
        {(type !== 'song' ? ['name'] : songAttributes).map((attribute) => (
          <button
            key={attribute}
            onClick={() => {
              if (orderBy === attribute){
                setOrderDirection(-orderDirection);
              } else {
                setOrderDirection(1);
              }
              setOrder(attribute);
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              orderBy === attribute
                ? 'border-orange-500 text-orange-500 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {capitalize(attribute)} 
            {attribute === orderBy ? (orderDirection === 1 ? ' ↑' : ' ↓') : ''}
          </button>
        ))}
      </div>    
      {type === 'song' && (
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-6">Song</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Year</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredMods.song.map((mod) => (
                <tr key={mod.path} className="border-b border-zinc-800 hover:bg-zinc-900">
                  <td className="p-3 text-sm">{capitalize(mod.title)}</td>
                  <td className="p-3 text-sm">{startCase(mod.artist)}</td>
                  <td className="p-3 text-sm">{mod.year}</td>
                  <td className="p-3 text-sm">{mod.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {type !== 'song' && (
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-6">{capitalize(type)}</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {(filteredMods[type as keyof FilesStructure] as InfoMod[]).map((mod) => (
                <tr key={mod.path} className="border-b border-zinc-800 hover:bg-zinc-900">
                  <td className="p-3 text-sm">{capitalize(mod.name)}</td>
                  <td className="p-3 text-sm">{mod.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    
  )
}

export default App
