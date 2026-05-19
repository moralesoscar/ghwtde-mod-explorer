import { glob } from "glob";
import path from "path";
import ini from "ini";
import fs from "fs";
import type { InfoMod, InfoModBase, InfoModSong, InfoModOther, FilesStructure } from "../shared/types";


async function saveModsToJsonAtomic(filePath: string, data: FilesStructure): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    const tmpPath = `${filePath}.tmp-${Date.now()}`;
    const json = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(tmpPath, json, 'utf-8');
    await fs.promises.rename(tmpPath, filePath);
}

async function scan(modsPath: string) {
    console.log("Starting mod scanner...");

    try {
        const pattern = path.join(modsPath, "**/*.ini");
        const files = await glob(pattern, {windowsPathsNoEscape: true});

        const filesStructure: FilesStructure = {
            category: [],
            venue: [],
            song: [],
            character: [],
            instrument: []
        };

        files.forEach(file => {
            console.log("Found file:", file);

            let modtype = path.basename(file, '.ini').toLowerCase() as
                | 'category'
                | 'venue'
                | 'song'
                | 'character'
                | 'instrument'
                | string;
            if (modtype === 'folder') {
                modtype = 'category';
            }
            const content = fs.readFileSync(file, 'utf-8').toLowerCase();
            const ini_content = ini.parse(content || '') as any;

            const base: InfoModBase = {
                name: (ini_content?.modinfo?.name as string) || path.basename(path.dirname(file)) || 'No name available',
                description: (ini_content?.modinfo?.description as string) || 'No description available',
                path: file,
            };

            let mod: InfoMod;
            if (modtype === 'song') {
                // keys for song metadata
                const title = ini_content?.songinfo?.title;
                const artist = ini_content?.songinfo?.artist;
                const year = ini_content?.songinfo?.year;
                const category =  path.basename(path.dirname(path.dirname(file)));

                mod = {
                    ...base,
                    type: 'song',
                    title: title,
                    artist: artist,
                    year: year != 0? year : '-',
                    category: category,
                } as InfoModSong;
            } else {
                // other types
                mod = {
                    ...base,
                    type: modtype as InfoModOther['type'],
                } as InfoModOther;
            }

            switch (modtype) {
                case "category":
                    filesStructure["category"].push(mod);
                    break;
                case "venue":
                    filesStructure["venue"].push(mod);
                    break;
                case "song":
                    filesStructure["song"].push(mod);
                    break;
                case "character":
                    filesStructure["character"].push(mod);
                    break;
                case "instrument":
                    filesStructure["instrument"].push(mod);
                    break;
                default:
                    break;
            }
        });
        
        const outPath = path.join('./out', 'filesStructure.json');
        try {
            await saveModsToJsonAtomic(outPath, filesStructure);
            console.log('Saved files structure to', outPath);
        } catch (error) {
            console.error('Failed to save files structure:', error);
        }

    } catch (error) {
        console.error("Error occurred while scanning mods:", error);
    }
    
}

const dummypath = "games/Guitar Hero World Tour/DATA/MODS";
scan(dummypath);