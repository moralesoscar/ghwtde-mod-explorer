import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import './App.css'
import type { FilesStructure, InfoMod } from '../../src/shared/types'
//import mods from '../../out/filesStructure.json'
import { startCase, capitalize } from 'es-toolkit'

declare global {
  interface Window {
    electronAPI: {
      scanForMods: (path) => Promise<FilesStructure>;
    };
  }
}

function App() {
  const [type, setType] = useState('song');
  const [modsData, setModsData] = useState({category: [],
                                            venue: [],
                                            song: [],
                                            character: [],
                                            instrument: []} as FilesStructure);
  const [filteredMods, setFilteredMods] = useState(modsData);
  const [orderBy, setOrderBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [directoryPath, setDirectoryPath] = useState('c:/games/Guitar Hero World Tour/DATA/MODS');
  const [orderDirection, setOrderDirection] = useState(1);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    ScanAndSet(directoryPath);
  }, []);

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

  const ScanAndSet = async (modsPath) => {
      setLoading(true);
      console.log('ejecutar scan');
      if (window.electronAPI) {
        const scannedModData = await window.electronAPI.scanForMods(modsPath);
        console.log(scannedModData);
        setModsData(scannedModData);
        setFilteredMods(scannedModData);
      }
      console.log('scan terminado');
      setLoading(false);
    }

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
    <div className='min-h-screen bg-zinc-950 p-8 text-zinc-100'>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">GHWTDE Mod Explorer</h1>
        <h2 className="text-l font-bold text-orange-500">Mods Directory</h2>
        <div className="flex items-center gap-4 w-full pb-6">
          <input
            className="w-full bg-transparent border-b border-zinc-700 focus:border-blue-500 outline-none focus:ring-0 px-0" 
            type='text' 
            placeholder='Mods directory'
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}/>
          <button
            onClick={() => ScanAndSet(directoryPath)}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-zinc-100 rounded hover:bg-orange-600 transition-colors disabled:bg-orange-800"> Scan </button>
        </div>
        {loading && (
          <div 
            className="w-10 h-10 border-4 border-zinc-800 border-t-orange-400 rounded-full 
                       animate-spin mx-auto shadow-[0_0_15px_rgba(52,211,153,0.2)]">
          </div>
        )}
        {!loading && (
          <div>
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
              className="w-full bg-transparent border-b border-zinc-700 focus:border-blue-500 outline-none focus:ring-0 px-0 mb-4" 
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
        )}
      </div>
    </div>
    
  )
}

export default App
