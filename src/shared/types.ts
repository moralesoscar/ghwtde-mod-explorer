export interface InfoModBase {
    name: string;
    description: string;
    path: string;
}

export interface InfoModSong extends InfoModBase {
    type: 'song';
    title?: string | undefined;
    artist?: string | undefined;
    year?: number | string | undefined;
    category?: string | undefined;
}

export interface InfoModOther extends InfoModBase {
    type: 'category' | 'venue' | 'character' | 'instrument';
}

export type InfoMod = InfoModSong | InfoModOther;

export interface FilesStructure {
    category: InfoModOther[];
    venue: InfoModOther[];
    song: InfoModSong[];
    character: InfoModOther[];
    instrument: InfoModOther[];
};