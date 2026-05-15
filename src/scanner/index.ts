import { glob } from "glob";
import path from "path";

async function scan(modsPath: string) {
    console.log("Starting mod scanner...");

    try {
        const pattern = path.join(modsPath, "**/*.ini");
        const files = await glob(pattern, {windowsPathsNoEscape: true});
        console.log("Found files:", files);
    } catch (error) {
        console.error("Error occurred while scanning mods:", error);
    }
    
}

const dummypath = "games/Guitar Hero World Tour/DATA/MODS";
scan(dummypath);