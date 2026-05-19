import { useState } from 'react'
import './App.css'
import type { FilesStructure, InfoMod } from '../../src/shared/types'
import mods from '../../out/filesStructure.json'
import { startCase, capitalize } from 'es-toolkit'

function App() {
  const [type, setType] = useState('song');
  const [modsData, setModsData] = useState(mods as FilesStructure);
  const [orderBy, setOrderBy] = useState('name');

  const setOrder = (field: string) => {
    setOrderBy(field);
    (modsData[type as keyof FilesStructure] as InfoMod[]).sort((a, b) => {
      const aValue = (a as any)[field] || '';
      const bValue = (b as any)[field] || '';
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
    setModsData({ ...modsData }); // trigger re-render
  };

  return (
    <>
      <h1>GHWTDE Mod Explorer {startCase('+44')}</h1>
      <div>
        <button onClick={() => setType('category')}>Categories</button>
        <button onClick={() => setType('venue')}>Venues</button>
        <button onClick={() => setType('song')}>Songs</button>
        <button onClick={() => setType('character')}>Characters</button>
        <button onClick={() => setType('instrument')}>Instruments</button>
      </div>    
      {type === 'song' && (
        <div>
          <h2>Song</h2>
          <div>
            <button onClick={() => setOrder('title')}>Sort by Title</button>
            <button onClick={() => setOrder('artist')}>Sort by Artist</button>
            <button onClick={() => setOrder('year')}>Sort by Year</button>
            <button onClick={() => setOrder('category')}>Sort by Category</button>
          </div>
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
              {modsData.song.map((mod) => (
                <tr key={mod.path}>
                  <td>{capitalize(mod.title)}</td>
                  <td>{startCase(mod.artist)}</td>
                  <td>{mod.year}</td>
                  <td>{mod.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {type !== 'song' && (
        <div>
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {(modsData[type as keyof FilesStructure] as InfoMod[]).map((mod) => (
                <tr key={mod.path}>
                  <td>{mod.name}</td>
                  <td>{mod.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>

    
  )
}

export default App
